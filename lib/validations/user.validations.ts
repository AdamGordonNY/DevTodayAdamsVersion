import { z } from "zod";

import { Goals, Levels, Tech, Platform } from "@prisma/client";
const SocialMediaSchema = z.object({
  platform: z.nativeEnum(Platform),
  handle: z.string(),
  link: z.string(),
});
export const UserSchema = z.object({
  id: z.number(),
  clerkID: z.string(),
  onboardingStep: z.number().optional(),
  level: z.nativeEnum(Levels).optional(),
  goal: z.nativeEnum(Goals).optional().nullable(),
  tech: z.array(z.nativeEnum(Tech)).optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  createdAt: z.date().optional(),
  socials: z.array(SocialMediaSchema).optional(),
});

export const UserProfileUpdateSchema = z.object({
  id: z.number(),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string(),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  tech: z.array(z.nativeEnum(Tech)),
  image: z.string().url(),

  socialMedia: z.array(SocialMediaSchema).optional(),
});
export type IUserProfileUpdateSchema = z.infer<typeof UserProfileUpdateSchema>;
export const IUserSocials = UserSchema.pick({ socials: true });

export type ISocialSchema = z.infer<typeof SocialMediaSchema>;
export type IUserSchema = z.infer<typeof UserSchema>;

export const IUserLevels = UserSchema.pick({ level: true });
export type ILevelsSchema = z.infer<typeof IUserLevels>;

export const IUserGoals = UserSchema.pick({ goal: true });
export type IGoalsSchema = z.infer<typeof IUserGoals>;

export const IUserTech = UserSchema.pick({ tech: true });
export type ITechSchema = z.infer<typeof IUserTech>;
