"use server";

import { prisma } from "@/db";
import { Group, User } from "@prisma/client";
// eslint-disable-next-line camelcase
import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@clerk/nextjs";

import { TopRankGroups } from "./shared.types.d";
import { IGroupSchema } from "../validations/group.validations";
import { getUserIdWithClerkID } from "./user.actions";

export async function createGroup(data: any, authorId: number) {
  try {
    if (data as Group) {
      const { groupAdmins, groupMembers, ...rest } = data;

      const group = await prisma.group.create({
        data: {
          ...rest,
          ...(groupAdmins.length > 0 && {
            admins: {
              connect: groupAdmins.map((admin: User) => {
                return { id: admin.id };
              }),
            },
          }),
          ...(groupMembers.length > 0 && {
            members: {
              connect: groupMembers.map((member: User) => {
                return { id: member.id };
              }),
            },
          }),
          author: {
            connect: { id: authorId },
          },
        },
      });
      return { group, error: null };
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return { error: "An unexpected error occurred while creating group." };
  }
  return { error: "An unexpected error occurred while creating group." };
}

export async function updateGroup(data: IGroupSchema, groupId: number) {
  try {
    if (data) {
      const { groupAdmins, groupMembers, ...rest } = data;

      const group = await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          ...rest,
          ...(groupAdmins &&
            groupAdmins.length > 0 && {
              admins: {
                set: [],
                connect: groupAdmins.map((admin: Partial<User>) => {
                  return { id: admin.id };
                }),
              },
            }),
          ...(groupMembers &&
            groupMembers.length > 0 && {
              members: {
                set: [],
                connect: groupMembers.map((member: Partial<User>) => {
                  return { id: member.id };
                }),
              },
            }),
        },
        include: {
          admins: true,
          members: true,
        },
      });

      revalidateTag("getGroupById");
      return { group, error: null };
    }
  } catch (error) {
    console.error("Error updating group:", error);
    return { error: "An unexpected error occurred while updating group." };
  }
}

export async function deleteGroup(id: number) {
  try {
    const { userId } = await getUserIdWithClerkID();

    const group = await prisma.group.findUnique({
      where: { id },
      select: { admins: { select: { id: true } } },
    });

    if (!group) {
      throw new Error("Group not found.");
    }

    const isAdmin = group.admins.some((admin) => admin.id === userId);

    if (!isAdmin) {
      throw new Error("You are not an admin of this group.");
    }

    const deletedGroup = await prisma.group.delete({
      where: { id },
    });

    return deletedGroup;
  } catch (error) {
    console.error("Error deleting group:", error);
    throw new Error("An unexpected error occurred while deleting group.");
  }
}

export async function getAllGroups(userId: number) {
  try {
    if (userId) {
      const groups = await prisma.user.findMany({
        where: {
          id: Number(userId),
        },
        select: {
          adminGroups: true,
          memberGroups: true,
        },
      });

      const extractedGroups = groups && groups[0];

      return { extractedGroups, error: null };
    }
  } catch (error) {
    console.log(error);
    console.error("Error returning group:", error);
    return { error: "An unexpected error occurred while returning group." };
  }
}

export async function _getGroupById(id: string) {
  try {
    const group = await prisma.group.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        author: true,
        meetups: {
          orderBy: {
            startTime: "desc",
          },
          take: 5,
        },
        admins: {
          orderBy: {
            firstName: "asc",
          },
          take: 5,
        },
        members: {
          orderBy: {
            firstName: "asc",
          },
          take: 14,
        },
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        _count: {
          select: {
            posts: true,
            members: true,
            admins: true,
          },
        },
      },
    });

    return { group, error: null };
  } catch (error) {
    console.error("Error returning group:", error);
    return { error: "An unexpected error occurred while returning group." };
  }
}

export const getGroupById = unstable_cache(_getGroupById, ["_getGroupById"], {
  tags: ["getGroupById", "commentPages", "likes", "views", "User"],
  revalidate: 1,
});

export async function getTopRankedGroups() {
  try {
    const totals = await prisma.$queryRaw`
    SELECT
    "Group".id,
    "Group".name,
    "Group"."coverImage",
    (
      (
        SELECT COUNT(*) FROM "Post" WHERE "Post"."groupId" = "Group".id
      ) +
       (
        SELECT COUNT(*) FROM "Meetup" WHERE "Meetup"."groupId" = "Group".id
      ) +
       (
        SELECT COUNT(*) FROM "Podcast" WHERE "Podcast"."groupId" = "Group".id
      ) +
       (
        SELECT COUNT(*) FROM "_GroupMembers" WHERE "_GroupMembers"."A" = "Group".id
      ) +
       (
        SELECT COUNT(*) FROM "_GroupAdmins" WHERE "_GroupAdmins"."A" = "Group".id
      )
    ) AS "totals",
    (
      (
        SELECT COUNT(*) FROM "Post" WHERE "Post"."groupId" = "Group".id
      ) +
       (
        SELECT COUNT(*) FROM "Meetup" WHERE "Meetup"."groupId" = "Group".id
      ) +
       (
        SELECT COUNT(*) FROM "Podcast" WHERE "Podcast"."groupId" = "Group".id
      )
    ) AS "totalsExcludingMembers"

  FROM "Group"
  ORDER BY "totals" DESC
  limit 5`;

    return { totals, error: null };
  } catch (error) {
    console.log("Error returning totals:", error);
    console.error("Error fetching totals:", error);
  }
}

export async function getDynamicGroups(
  page: number,
  type: "newest" | "popular" | "following" | "joined",
  pageSize: number
) {
  try {
    const skip = (page - 1) * pageSize;
    const totalGroups = await prisma.group.count();
    const totalPages = Math.ceil(totalGroups / pageSize);

    let groups;

    if (type === "joined") {
      const user = await prisma.user.findUnique({
        where: {
          clerkID: auth().userId!,
        },
        include: {
          memberGroups: true,
          adminGroups: true,
        },
      });

      const groupIds = [
        ...(user?.adminGroups?.map((group) => group.id) || []),
        ...(user?.memberGroups?.map((group) => group.id) || []),
      ];

      groups = await prisma.group.findMany({
        where: {
          id: { in: groupIds },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
        include: {
          _count: { select: { posts: true } },
          admins: { select: { id: true, image: true } },
          members: { select: { id: true, image: true } },
        },
      });
      const totalPages = Math.ceil(groupIds.length / pageSize);
      return {
        groups: groups.map((group) => ({
          ...group,
          postCount: group._count.posts,
          users: [
            ...group.admins.map((admin) => ({
              id: admin.id,
              image: admin.image,
              role: "admin",
            })),
            ...group.members.map((member) => ({
              id: member.id,
              image: member.image,
              role: "member",
            })),
          ],
          userCount: group.admins.length + group.members.length,
        })),
        totalPages,
        error: null,
      };
    }
    if (type === "popular") {
      groups = await prisma.group.findMany({
        orderBy: {
          posts: { _count: "desc" },
        },
        skip,
        take: pageSize,
        include: {
          _count: { select: { posts: true } },
          admins: { select: { id: true, image: true } },
          members: { select: { id: true, image: true } },
        },
      });

      return {
        groups: groups.map((group) => ({
          ...group,
          postCount: group._count.posts,
          users: [
            ...group.admins.map((admin) => ({
              id: admin.id,
              image: admin.image,
              role: "admin",
            })),
            ...group.members.map((member) => ({
              id: member.id,
              image: member.image,
              role: "member",
            })),
          ],
          userCount: group.admins.length + group.members.length,
        })),
        totalPages,
        error: null,
      };
    }
    if (type === "newest") {
      groups = await prisma.group.findMany({
        orderBy: {
          ...(type === "newest" && { createdAt: "desc" }),
        },
        skip,
        take: pageSize,
        include: {
          _count: { select: { posts: true } },
          admins: { select: { id: true, image: true } },
          members: { select: { id: true, image: true } },
        },
      });
      return {
        groups: groups.map((group) => ({
          ...group,
          postCount: group._count.posts,
          users: [
            ...group.admins.map((admin) => ({
              id: admin.id,
              image: admin.image,
              role: "admin",
            })),
            ...group.members.map((member) => ({
              id: member.id,
              image: member.image,
              role: "member",
            })),
          ],
          userCount: group.admins.length + group.members.length,
        })),
        totalPages,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error returning groups:", error);
    return { error: "An unexpected error occurred while returning groups." };
  }
}
export const getActiveGroups = async () => {
  try {
    const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);

    const topGroups: TopRankGroups[] = await prisma.$queryRaw`
    SELECT
      g.id,
      g.name,
      g."coverImage",
       COALESCE(posts.count, 0)::int + COALESCE(podcasts.count, 0)::int + COALESCE(meetups.count, 0)::int AS "postCount"
    FROM "Group" g
    LEFT JOIN (
      SELECT "groupId", COUNT(*) AS count
      FROM "Post"
      WHERE "createdAt" > ${seventyTwoHoursAgo}
      GROUP BY "groupId"
    ) posts ON posts."groupId" = g.id
    LEFT JOIN (
      SELECT "groupId", COUNT(*) AS count
      FROM "Podcast"
      WHERE "createdAt" > ${seventyTwoHoursAgo}
      GROUP BY "groupId"
    ) podcasts ON podcasts."groupId" = g.id
    LEFT JOIN (
      SELECT "groupId", COUNT(*) AS count
      FROM "Meetup"
      WHERE "createdAt" > ${seventyTwoHoursAgo}
      GROUP BY "groupId"
    ) meetups ON meetups."groupId" = g.id
    GROUP BY g.id, g.name, g."coverImage", posts.count, podcasts.count, meetups.count
    ORDER BY "postCount" DESC
    LIMIT 5
  `;

    return topGroups;
  } catch (error) {
    console.error("Error fetching active groups:", error);
    return {
      error: "An error occurred while fetching active groups.",
    };
  }
};

export const getTopRankGroups = async (): Promise<TopRankGroups[]> => {
  try {
    const topGroups: TopRankGroups[] = await prisma.$queryRaw`
   SELECT
      g.id,
      g.name,
      g."coverImage",
      COALESCE(posts.count, 0)::int + COALESCE(podcasts.count, 0)::int + COALESCE(meetups.count, 0)::int AS "postCount"
    FROM "Group" g
    LEFT JOIN (
      SELECT "groupId", COUNT(*) AS count
      FROM "Post"
      GROUP BY "groupId"
    ) posts ON posts."groupId" = g.id
    LEFT JOIN (
      SELECT "groupId", COUNT(*) AS count
      FROM "Podcast"
      GROUP BY "groupId"
    ) podcasts ON podcasts."groupId" = g.id
    LEFT JOIN (
      SELECT "groupId", COUNT(*) AS count
      FROM "Meetup"
      GROUP BY "groupId"
    ) meetups ON meetups."groupId" = g.id
    GROUP BY g.id, g.name, g."coverImage", posts.count, podcasts.count, meetups.count
    ORDER BY "postCount" DESC
    LIMIT 5
  `;

    return topGroups as TopRankGroups[];
  } catch (error) {
    console.error("Error fetching top rank groups:", error);
    return [];
  }
};
export const getJoinedGroupCount = async () => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkID: auth().userId!,
      },
      include: {
        memberGroups: true,
        adminGroups: true,
      },
    });

    const groupIds = [
      ...(user?.adminGroups?.map((group) => group.id) || []),
      ...(user?.memberGroups?.map((group) => group.id) || []),
    ];

    return groupIds.length;
  } catch (error) {
    console.error("Error fetching joined group count:", error);
    return 0;
  }
};

export async function addOrRemoveGroupUser(groupId: number, userId: number) {
  try {
    const existingMember = await prisma.group.findUnique({
      where: {
        id: groupId,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    const group = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          ...(existingMember
            ? {
                disconnect: {
                  id: userId,
                },
              }
            : {
                connect: {
                  id: userId,
                },
              }),
        },
      },
    });

    revalidateTag("getGroupById");
    revalidateTag("User");
    return { group, error: null };
  } catch (error) {
    console.error("Error adding user:", error);
    return {
      error: "An unexpected error occurred while adding user to group.",
    };
  }
}
export const checkIfAdmin = async (groupId: number) => {
  try {
    const { userId } = await getUserIdWithClerkID();
    if (userId) {
      const existingAdmin = await prisma.group.findUnique({
        where: {
          id: groupId,
          admins: {
            some: {
              id: userId,
            },
          },
        },
      });
      if (existingAdmin) {
        return { isAdmin: true, error: null };
      } else {
        return { isAdmin: false, error: "User is not an admin." };
      }
    } else {
      return { isAdmin: false, error: "User is not an admin." };
    }
  } catch (error) {
    console.log(error);
    throw new Error("An unexpected error occurred while checking admin.");
  }
};
export const _toggleAdmin = async (groupId: number, targetUserId: number) => {
  try {
    const { isAdmin } = await checkIfAdmin(groupId);
    if (isAdmin) {
      const makeAdmin = await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          admins: {
            connect: {
              id: targetUserId,
            },
          },
        },
      });
      if (!makeAdmin) {
        return {
          ok: false,
          error: null,
          message: "User could not be made an admin.",
        };
      }
      return {
        ok: true,
        error: null,
        message: "User has been made an admin.",
      };
    }
  } catch (error) {
    console.error("Error toggling admin:", error);
    throw new Error("An unexpected error occurred while toggling admin.");
  }
};
export const toggleAdmin = unstable_cache(_toggleAdmin, ["_toggleAdmin"], {
  tags: ["toggleAdmin", "User", "groupInfo"],
});
