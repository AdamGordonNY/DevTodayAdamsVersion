"use client";

import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";

import { NotificationType } from "@prisma/client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import StatusWrapper from "../shared/StatusWrapper";
import { ProfilePlaceholder } from "../ui";
import { NotificationWithActionByAndPost } from "@/lib/types.d";

const NotificationMenuItem = ({
  notification,
}: {
  notification: NotificationWithActionByAndPost;
}) => {
  const {
    createdAt,
    actionBy: { firstName, lastName, image },
    type,
    read,
  } = notification;
  const notificationTime = formatDistanceToNowStrict(new Date(createdAt));
  const [imageSuccessfullyLoaded, setImageSuccessfullyLoaded] = useState(true);

  const renderTypeAndPostTitle = (type: string, title?: string) => {
    switch (type) {
      case NotificationType.like:
        return `Liked your Post (${title})`;
      case NotificationType.follow:
        return "Has started following you";
      case NotificationType.comment:
        return `Commented on your Post (${title})`;
      default:
        break;
    }
  };

  return (
    <DropdownMenuItem className="flex items-center gap-x-2 focus:bg-white-200 dark:focus:bg-dark-700">
      {image && imageSuccessfullyLoaded ? (
        <StatusWrapper status={read ? "none" : "new"}>
          {
            <Image
              onError={() => {
                setImageSuccessfullyLoaded(false);
              }}
              src={image}
              width={40}
              height={40}
              alt="actionBy's Profile Image"
            />
          }
        </StatusWrapper>
      ) : (
        <div>
          <ProfilePlaceholder
            size={36}
            status={read ? "none" : "newWithoutBorder"}
            className="shrink-0"
          />
        </div>
      )}

      <div className="w-full cursor-pointer flex-col hover:bg-none">
        <div className="flex justify-between">
          <p className="paragraph-3-bold text-dark-800 dark:text-white-200">
            {firstName} {lastName}
          </p>
          <p className="subtitle-regular text-dark-700 dark:text-white-300">
            {notificationTime} ago
          </p>
        </div>
        <p className="paragraph-4-regular w-72 truncate text-white-400 max-md:w-60 dark:text-white-300">
          {renderTypeAndPostTitle(
            type,
            (notification.post && notification.post.title) ?? ""
          )}
        </p>
      </div>
    </DropdownMenuItem>
  );
};

export default NotificationMenuItem;
