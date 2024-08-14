"use server";

import { prisma } from "@/db";
// eslint-disable-next-line camelcase
import { revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@clerk/nextjs";

import { GroupDetailsResult, TopRankGroups } from "./shared.types";

import { getUserIdWithClerkID } from "./user.actions";
import { Group } from "@prisma/client";

export async function createGroup(data: any, authorId: number) {
  try {
    if (data) {
      const { groupUsers, ...rest } = data;

      const group = await prisma.group.create({
        data: {
          ...rest,
          createdBy: authorId,
        },
      });

      const groupUsersData = [
        {
          userId: authorId,
          groupId: group.id,
          role: "OWNER",
        },
        ...groupUsers.map((admin: { id: number }) => ({
          userId: admin.id,
          groupId: group.id,
          role: "ADMIN",
        })),
        ...groupUsers.map((member: { id: number }) => ({
          userId: member.id,
          groupId: group.id,
          role: "MEMBER",
        })),
      ];

      await prisma.groupUser.createMany({
        data: groupUsersData,
      });

      return { group, error: null };
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return { error: "An unexpected error occurred while creating group." };
  }
  return { error: "An unexpected error occurred while creating group." };
}

export async function updateGroup(data: any, groupId: number) {
  try {
    if (data) {
      const { groupAdmins, groupMembers, ...rest } = data;

      const group = await prisma.group.update({
        where: { id: groupId },
        data: rest,
      });

      // Clear existing roles and update with new ones
      await prisma.groupUser.deleteMany({
        where: { groupId, role: { in: ["ADMIN", "MEMBER"] } },
      });

      const groupUsersData = [
        ...groupAdmins.map((admin: { id: number }) => ({
          userId: admin.id,
          groupId,
          role: "ADMIN",
        })),
        ...groupMembers.map((member: { id: number }) => ({
          userId: member.id,
          groupId,
          role: "MEMBER",
        })),
      ];

      await prisma.groupUser.createMany({
        data: groupUsersData,
      });

      revalidateTag("getGroupById");
      return { group, error: null };
    }
  } catch (error) {
    console.error("Error updating group:", error);
    return { error: "An unexpected error occurred while updating group." };
  }
  return { error: "An unexpected error occurred while updating group." };
}

export async function deleteGroup(id: number) {
  try {
    const { userId } = await getUserIdWithClerkID();

    const group = await prisma.group.findUnique({
      where: { id },
      select: {
        groupUsers: {
          where: {
            userId,
            role: {
              in: ["OWNER", "ADMIN"],
            },
          },
          select: { role: true },
        },
      },
    });

    if (!group || group.groupUsers.length === 0) {
      throw new Error("You do not have permission to delete this group.");
    }

    const deletedGroup = await prisma.group.delete({
      where: { id },
    });

    return { group: deletedGroup, error: null };
  } catch (error) {
    console.error("Error deleting group:", error);
    return { error: "An unexpected error occurred while deleting group." };
  }
}
export async function getAllGroups(userId: number) {
  try {
    if (userId) {
      const userGroups = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        select: {
          groupRoles: {
            select: {
              group: true,
              role: true,
            },
          },
        },
      });

      if (!userGroups) {
        return { error: "User not found." };
      }

      const adminGroups = userGroups.groupRoles
        .filter((role) => role.role === "ADMIN")
        .map((role) => role.group);

      const memberGroups = userGroups.groupRoles
        .filter((role) => role.role === "MEMBER")
        .map((role) => role.group);

      const ownerGroups = userGroups.groupRoles
        .filter((role) => role.role === "OWNER")
        .map((role) => role.group);

      return { adminGroups, memberGroups, ownerGroups, error: null };
    } else {
      return { error: "Invalid user ID." };
    }
  } catch (error) {
    console.log(error);
    console.error("Error returning groups:", error);
    return { error: "An unexpected error occurred while returning groups." };
  }
}

export const getDynamicGroups = async (
  page: number,
  type: "newest" | "popular" | "following" | "joined",
  pageSize: number
) => {
  try {
    const skip = (page - 1) * pageSize;
    const totalGroups = await prisma.group.count();
    const totalPages = Math.ceil(totalGroups / pageSize);

    let groups: Group[];

    if (type === "joined") {
      const user = await prisma.user.findUnique({
        where: {
          clerkID: auth().userId!,
        },
        include: {
          groups: true,
        },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      const groupIds = user.groups.map((grp) => grp.id);

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
          groupUsers: {
            include: {
              user: true,
            },
          },
        },
      });

      return {
        groups,
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
          groupUsers: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              posts: true,
              podcasts: true,
              meetups: true,
              groupUsers: true,
            },
          },
        },
      });

      return {
        groups,

        totalPages,
        error: null,
      };
    }

    if (type === "newest") {
      groups = await prisma.group.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
        include: {
          _count: {
            select: {
              posts: true,
              podcasts: true,
              meetups: true,
              groupUsers: true,
            },
          },
          groupUsers: {
            include: {
              user: { select: { id: true, image: true, username: true } },
            },
          },
        },
      });

      return {
        groups,

        totalPages,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error returning groups:", error);
    return {
      groups: [],
      error: "An unexpected error occurred while returning groups.",
      totalPages: 0,
    };
  }
};
export const grabGroupToEdit = async (id: string) => {
  try {
    const group = await prisma.group.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        about: true,
        coverImage: true,
        groupUsers: { include: { user: true } },
      },
    });
    return group as Partial<Group>;
  } catch (error) {}
};
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
        groupRoles: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const groupIds = new Set(user.groupRoles.map((role) => role.groupId));

    return groupIds.size;
  } catch (error) {
    console.error("Error fetching joined group count:", error);
    return 0;
  }
};

export const getFullGroupDetails = async (
  groupId: number,
  loggedInUserId: number
): Promise<GroupDetailsResult> => {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      posts: {
        include: {
          _count: {
            select: {
              comment: true,
            },
          },
          comment: true,
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      },
      podcasts: {
        include: {
          comment: true,
          _count: {
            select: {
              comment: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      },
      meetups: {
        include: {
          _count: {
            select: {
              comment: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      },
      groupUsers: {
        include: {
          user: {
            include: {
              followers: true,
              following: true,
            },
          },
        },
      },
    },
  });

  const owner = await prisma.user.findUnique({
    where: { id: group?.createdBy },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      image: true,
    },
  });

  if (!owner) {
    throw new Error(`Owner with ID ${group?.createdBy} not found.`);
  }

  const adminsAndOwners = group?.groupUsers
    .filter(
      (groupUser) => groupUser.role === "ADMIN" || groupUser.role === "OWNER"
    )
    .map((groupUser) => ({
      id: groupUser.user.id,
      username: groupUser.user.username,
      image: groupUser.user.image,
      following: groupUser.user.following,
      followers: groupUser.user.followers,
    }))!;

  const loggedInUserRole =
    group?.groupUsers.find((groupUser) => groupUser.userId === loggedInUserId)
      ?.role || "GUEST";

  const members = group?.groupUsers
    .filter((groupUser) => groupUser?.role === "MEMBER")
    .map((groupUser) => ({
      id: groupUser.user?.id!,
      username: groupUser.user?.username!,
      image: groupUser.user?.image!,
      following: groupUser.user?.following!,
      followers: groupUser.user?.followers!,
      clerkID: groupUser.user?.clerkID || "",
    }))!;

  const loggedInUser = await prisma.user.findUnique({
    where: { id: loggedInUserId },
    include: {
      following: {
        select: { id: true },
      },
      followers: {
        select: { id: true },
      },
      groupRoles: {
        where: { groupId },
        select: { role: true },
      },
      groups: true,
    },
  });

  if (!loggedInUser) {
    throw new Error(`User with ID ${loggedInUserId} not found.`);
  }

  const isAdminOrOwner = adminsAndOwners?.some(
    (groupUser) => groupUser.id === loggedInUserId
  );

  return {
    group: {
      id: group?.id!,
      createdAt: group?.createdAt!,
      name: group?.name!,
      coverImage: group?.coverImage! || null,
      profileImage: group?.profileImage! || null,
      about: group?.about! || "",
      createdBy: group?.createdBy!,
      posts: group?.posts?.map((post) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        createdAt: post.createdAt,
        _count: { comment: post._count.comment },
        user: {
          id: post.user.id,
          username: post.user.username,
          image: post.user.image,
        },
      }))!,
      podcasts: group?.podcasts?.map((podcast) => ({
        id: podcast.id,
        title: podcast.title,
        body: podcast.body,
        createdAt: podcast.createdAt,
        _count: { comment: podcast._count.comment },
        user: {
          id: podcast.user.id,
          username: podcast.user.username,
          image: podcast.user.image,
        },
      }))!,
      meetups: group?.meetups?.map((meetup) => ({
        id: meetup.id,
        title: meetup.title,
        body: meetup.body,
        createdAt: meetup.createdAt,
        startTime: meetup.startTime,
        endTime: meetup.endTime,
        address: meetup.address,
        _count: { comment: meetup._count.comment },
        user: {
          id: meetup.user?.id!,
          username: meetup.user?.username!,
          image: meetup.user?.image!,
        },
      }))!,
      groupUsers: group?.groupUsers?.map((groupUser) => ({
        groupId: groupUser?.groupId!,
        userId: groupUser?.userId!,
        role: groupUser?.role!,
        user: {
          id: groupUser?.user?.id!,
          username: groupUser?.user?.username!,
          image: groupUser?.user?.image!,
        },
      }))!,
    },
    adminsAndOwners,
    members,
    totalMembersCount: group?.groupUsers?.length,
    isAdminOrOwner,
    loggedInUser: {
      id: loggedInUser.id,
      username: loggedInUser.username,
      image: loggedInUser.image,
      following: loggedInUser.following,
      followers: loggedInUser.followers,
      clerkID: loggedInUser.clerkID || "",
      role: loggedInUserRole,
    },
    owner,
  };
};
export const _getFullGroupDetails = unstable_cache(
  getFullGroupDetails,
  ["getFullGroupDetails"],
  {
    tags: ["getGroupById", "commentPages", "likes", "User", "Group"],
    revalidate: 10,
  }
);

// export async function addOrRemoveGroupUser(groupId: number, userId: number) {
//   try {
//     const whereInput = {
//       groupId_userId: {
//         groupId,
//         userId,
//       },
//     };

//     const existingMember = await prisma.groupUser.findUnique({
//       where: whereInput,
//     });

//     if (existingMember) {
//       await prisma.groupUser.delete({
//         where: whereInput,
//       });
//     } else {
//       await prisma.groupUser.create({
//         data: {
//           groupId,
//           userId,
//           role: "MEMBER",
//         },
//       });
//     }

//     revalidateTag("getGroupById");
//     return { error: null };
//   } catch (error) {
//     console.error("Error adding or removing user:", error);
//     return {
//       error:
//         "An unexpected error occurred while adding or removing user from group.",
//     };
//   }
// }
