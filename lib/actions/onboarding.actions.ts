"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Levels, Goals, Tech, Prisma, User, Platform } from "@prisma/client";
import { prisma } from "@/db";
export const completeOnboarding = async ({
  step,
  option,
}: {
  step: string;
  option: Tech[];
}) => {
  const { userId } = auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { clerkID: userId! },
      data: {
        onboardingStep: parseInt(step) + 1,
        tech: option,
      },
      include: {
        SocialMedia: true,
        followers: true,
        following: true,
      },
    });
    if (updatedUser) {
      const res = await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          onboardingComplete: true,
        },
      });
      if (res) return { message: "onboardingComplete", ok: true };
    }
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};

export const createUserFromHook = async (userData: Prisma.UserCreateInput) => {
  const { clerkID, username, email } = userData;
  let hasUsername = 0;
  if (!username) {
    hasUsername = 1;
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...userData,
        username: hasUsername === 0 ? username : email.split("@")[0],
        tech: [Tech.js],
        level: Levels.LearningEnthusiast, // Assign a valid value to the level property
        goal: Goals.BuildPortfolio,
        SocialMedia: {
          createMany: {
            data: [
              {
                platform: Platform.LinkedIn,
                link: "https://linkedin.com/in/defaultuser",
                handle: "defaultuser",
              },
              {
                platform: Platform.Instagram,
                link: "https://instagram.com/defaultuser",
                handle: "defaultuser",
              },
              {
                platform: Platform.Twitter,
                link: "https://twitter.com/defaultuser",
                handle: "defaultuser",
              },
            ],
          },
        },
      },
    });

    await clerkClient.users.updateUser(clerkID!, {
      publicMetadata: {
        onboardingComplete: false,
      },
    });

    return user as User;
  } catch (error) {
    return { error: "There was an error creating the user." };
  }
};

export const updateUserOnboardingStep = async ({
  step,
  option,
}: {
  step: string;
  option: Levels | Goals | Tech[];
}) => {
  const { userId } = auth();
  if (!userId) {
    return { message: "No Logged In User" };
  }

  if (step === "1") {
    const optionTyped = option as Levels;

    try {
      const updatedUser = await prisma.user.update({
        where: { clerkID: userId! },
        data: { onboardingStep: parseInt(step) + 1, level: optionTyped },
      });
      if (updatedUser) {
        return { user: updatedUser, ok: true };
      }
    } catch (error) {
      return { error: "There was an error updating the user onboarding step." };
    }
  }

  if (step === "2") {
    const optionTyped = option as Goals;

    try {
      const updatedUser = await prisma.user.update({
        where: { clerkID: userId! },
        data: { onboardingStep: parseInt(step) + 1, goal: optionTyped },
      });

      return { user: updatedUser, ok: true };
    } catch (error) {
      return { error: "There was an error updating the user onboarding step." };
    }
  } else if (step === "3") {
    const optionTyped = option as Tech[];
    try {
      const updatedUser = await completeOnboarding({
        step,
        option: optionTyped,
      });

      return {
        user: updatedUser,
        ok: true,
      };
    } catch (error) {
      return { error: "There was an error updating the user onboarding step." };
    }
  }
};
export const updateUserFromHook = async (data: Prisma.UserUpdateInput) => {
  const { clerkID, email, image, firstName, lastName } = data;

  try {
    const user = await prisma.user.update({
      where: { clerkID: clerkID as string },
      data: { email, image, firstName, lastName },
    });

    return user;
  } catch (error) {
    return { error: "There was an error updating the user." };
  }
};
export const deleteUserFromHook = async (clerkID: string) => {
  try {
    const user = await prisma.user.delete({
      where: { clerkID },
    });
    return { user };
  } catch (error) {
    return { error: "There was an error deleting the user." };
  }
};
