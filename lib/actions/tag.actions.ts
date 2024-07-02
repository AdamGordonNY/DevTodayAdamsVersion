import prisma from "@/db";
export type Tag = {
  tag: string;
  tag_count: number;
};

export async function getTopFiveTags() {
  try {
    const tags: Tag[] = await prisma.$queryRaw`
    SELECT tag, COUNT(tag)::int AS tag_count
    FROM (
      SELECT unnest(tags) AS tag FROM "Post"
      UNION ALL
      SELECT unnest(tags) AS tag FROM "Meetup"
      UNION ALL
      SELECT unnest(tags) AS tag FROM "Podcast"
    ) t
    GROUP BY tag
    ORDER BY tag_count DESC
    LIMIT 5;
    `;

    return { tags };
  } catch (error) {
    console.error("Error retrieving top tags:", error);
    return {
      error: "An unexpected error occurred while retrieving top tags.",
    };
  }
}

// Function to get the 5 newest tags
export async function getNewestTags(): Promise<string[]> {
  try {
    // Query to find the newest tags based on creation date
    const newestTags: string[] = await prisma.$queryRaw`
      SELECT tag
      FROM (
        SELECT UNNEST(tags) AS tag
        FROM Post
        UNION ALL
        SELECT UNNEST(tags) AS tag
        FROM Meetup
        UNION ALL
        SELECT UNNEST(tags) AS tag
        FROM Podcast
      ) AS all_tags
      ORDER BY created_at DESC
      LIMIT 5;
    `;

    return newestTags.map((tag: string) => tag);
  } catch (error) {
    console.error("Error fetching newest tags:", error);
    throw error;
  }
}

// Function to get the 5 most used tags of people you're following
export async function getMostUsedTags(userId: number): Promise<string[]> {
  try {
    // Query to find the most used tags based on content created by users you're following
    const mostUsedTags: string[] = await prisma.$queryRaw`
      SELECT tag, COUNT(*) AS tag_count
      FROM (
        SELECT UNNEST(tags) AS tag
        FROM Post
        WHERE "userId" IN (
          SELECT following_id
          FROM Following
          WHERE follower_id = ${userId}
        )
        UNION ALL
        SELECT UNNEST(tags) AS tag
        FROM Meetup
        WHERE "userId" IN (
          SELECT following_id
          FROM Following
          WHERE follower_id = ${userId}
        )
        UNION ALL
        SELECT UNNEST(tags) AS tag
        FROM Podcast
        WHERE "userId" IN (
          SELECT following_id
          FROM Following
          WHERE follower_id = ${userId}
        )
      ) AS all_tags
      GROUP BY tag
      ORDER BY tag_count DESC
      LIMIT 5;
    `;

    return mostUsedTags.map((tag: string) => tag);
  } catch (error) {
    console.error("Error fetching most used tags:", error);
    throw error;
  }
}
