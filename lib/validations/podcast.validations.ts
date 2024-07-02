import { z } from "zod";

export const PodcastSchema = z.object({
  title: z
    .string()
    .min(6, { message: "Title must contain at least 6 characters" }),
  body: z
    .string()
    .min(20, { message: "Body must contain at least 20 characters" }),
  image: z.string().optional(),
  audio: z.string(),
  tags: z.array(z.string()).optional(),
  group: z.object({
    id: z.number(),
    name: z.string().min(1, { message: "Group selection is required" }),
  }),
  audioTitle: z
    .string()
    .min(6, {
      message:
        "Audio title must contain at least 6 characters. Use a relatively  short title and episode number, ie: Podcast Name | Episode 1  ",
    }),
});

export type IPodcastSchema = z.infer<typeof PodcastSchema>;
