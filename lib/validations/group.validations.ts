import { z } from "zod";

export const GroupUserSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  username: z.string(),
  image: z.string().optional(),
  groupId: z.number().optional(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]).default("MEMBER"),
});

export const GroupSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, { message: "Group name must contain at least 3 characters" }),
  about: z
    .string()
    .min(20, { message: "Group bio must contain at least 20 characters" }),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  admins: z.array(GroupUserSchema).optional(),
  members: z
    .array(GroupUserSchema.omit({ image: true, id: true, groupId: true }))
    .optional(),
});

export type IGroupSchema = z.infer<typeof GroupSchema>;
