import { z } from "zod";

export const MeetupSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must contain at least 3 characters" }),
  body: z
    .string()
    .min(20, { message: "Body must contain at least 20 characters" }),
  image: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  location: z.object({
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
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
export type IMeetupSchema = z.infer<typeof MeetupSchema>;
