import { z } from "zod";

export const GroupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Group name must contain at least 3 characters" }),
  about: z
    .string()
    .min(20, { message: "Group bio must contain at least 20 characters" }),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  groupAdmins: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      id: z.number(),
    })
    .array()
    .optional(),
  groupMembers: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      id: z.number(),
    })
    .array()
    .optional(),
});
export type IGroupSchema = z.infer<typeof GroupSchema>;
