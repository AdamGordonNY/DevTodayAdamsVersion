"use server";

import { prisma } from "@/db";

export async function findContent(searchTerm: string) {
  try {
    const content = await prisma.$queryRaw`
    SELECT 'post' AS type, p.id, p.title, p.body FROM "Post" p
    WHERE
    p.title ILIKE ${"%" + searchTerm + "%"}
    OR
    p.body ILIKE ${"%" + searchTerm + "%"}

    UNION

    SELECT 'meetup' AS type, m.id, m.title, m.body FROM "Meetup" m
    WHERE
    m.title ILIKE ${"%" + searchTerm + "%"}
    OR
    m.body ILIKE ${"%" + searchTerm + "%"}

    UNION

    SELECT 'podcast' AS type, pod.id, pod.title, pod.body FROM "Podcast" pod
    WHERE
    pod.title ILIKE ${"%" + searchTerm + "%"}
    OR
    pod.body ILIKE ${"%" + searchTerm + "%"}

    UNION

    SELECT 'group' AS type, g.id, g.name, g.about FROM "Group" g
    WHERE
    g.name ILIKE ${"%" + searchTerm + "%"}
    OR
    g.about ILIKE ${"%" + searchTerm + "%"}

    OFFSET 0 ROWS
    FETCH FIRST 10 ROWS ONLY
    `;

    return { content, error: null };
  } catch (error) {
    console.log("Error returning content:", error);
    console.error("Error returning content:", error);
    return { error: "An unexpected error occurred while returning content." };
  }
}

export async function findUsers(searchTerm: string) {
  try {
    const users = await prisma.$queryRaw`
    SELECT 'user' AS type, u.id, u."firstName", u."lastName", u.image FROM "User" u
    WHERE
    u."firstName" ILIKE ${"%" + searchTerm + "%"}
    OR
    u."lastName" ILIKE ${"%" + searchTerm + "%"}

    OFFSET 0 ROWS
    FETCH FIRST 8 ROWS ONLY
    `;

    return { users, error: null };
  } catch (error) {
    console.log("Error returning content:", error);
    console.error("Error returning content:", error);
    return { error: "An unexpected error occurred while returning content." };
  }
}
