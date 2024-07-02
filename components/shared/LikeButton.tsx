"use client";

import React, { useEffect, useState, useTransition } from "react";
import Heart from "@/components/ui/icons/Heart";
import { likeCheck, likeToggle } from "@/lib/actions/content.actions";
import { ContentCategoryEnum } from "@/lib/types.d";
import { useUser } from "@clerk/nextjs";

interface LikeButtonProps {
  contentId: number;
  contentCategory: ContentCategoryEnum;
  size?: number;
  heartBgType?: "circle" | "square" | "none";
}

const LikeButton = ({
  contentId,
  contentCategory,
  size = 20,
  heartBgType = "circle",
}: LikeButtonProps) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState<boolean | null | undefined>(null);

  const [isPending, startTransition] = useTransition();

  const heartBackground = {
    circle: "rounded-full bg-white-300 p-2.5 dark:bg-dark-700",
    square: `rounded transition duration-300 dark:bg-dark-700 hover:bg-white-200 dark:hover:bg-dark-700 w-6 h-6 ${isLiked && "dark:bg-primary-100 bg-primary-100"}`,
    none: "rounded transition duration-300 hover:bg-white-200 dark:hover:bg-dark-700",
  };

  // if i add a like status prop, can I use that to update the like status?
  const handleToggle = async () => {
    const clerkId = user?.id;
    if (!clerkId) {
      console.error("User not logged in");
      return;
    }

    try {
      startTransition(async () => {
        const result = await likeToggle({
          clerkId,
          contentId,
          contentCategory,
        });
        if (result.error) {
          console.error("Error toggling like:", result.error);
        } else {
          setIsLiked(result.liked);
        }
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  useEffect(() => {
    const fetchLike = async () => {
      const clerkId = user?.id;
      if (!clerkId) return;

      try {
        const existingLike = await likeCheck({
          clerkId,
          contentId,
          contentCategory,
        });
        setIsLiked(existingLike.liked);
      } catch (err) {
        console.error("Error checking like:", err);
      }
    };

    if (user) {
      startTransition(async () => {
        fetchLike();
      });
    }
  }, [user, contentId, contentCategory]);

  return (
    <div>
      <button
        className={`flex size-[30px] items-center justify-center gap-x-2.5  ${heartBackground[heartBgType]} ${
          isPending ? "opacity-50" : "opacity-100"
        }`}
        onClick={handleToggle}
        disabled={isPending}
      >
        <Heart
          size={size}
          fill={
            isLiked
              ? "fill-primary-500"
              : heartBgType === "none"
                ? "fill-white-300"
                : "fill-white-400"
          }
          className={`${isPending ? "animate-pulse" : ""}`}
        />
      </button>
    </div>
  );
};

export default LikeButton;
