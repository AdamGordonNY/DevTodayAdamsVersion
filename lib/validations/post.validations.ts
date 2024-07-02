import { z } from "zod";

export const PostSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must contain at least 3 characters" }),
  image: z.string().optional(),
  body: z
    .string()
    .min(20, { message: "Body must contain at least 20 characters" }),
  tags: z
    .string()
    .array()
    .min(1, { message: "Add at least 1 tag" })
    .max(5, { message: "No more than 5 tags" }),
  group: z.object({
    id: z.number(),
    name: z.string().min(1, { message: "Group selection is required" }),
  }),
});
export type IPostSchema = z.infer<typeof PostSchema>;
