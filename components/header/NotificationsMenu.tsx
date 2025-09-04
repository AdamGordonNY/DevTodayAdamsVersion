"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

import { NotificationWithActionByAndPost } from "../../lib/types.d";
import { Bell } from "../ui/icons";
import MarkReadButton from "./MarkReadButton";
import { NotificationType } from "@prisma/client";
import {
  getNotifications,
  updateNotifications,
} from "@/lib/actions/notifications.actions";
import NotificationMenuItem from "./NotificationMenuItem";
import ScrollController from "./ScrollController";

const NotificationsMenu = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<{
    recentNotifications: NotificationWithActionByAndPost[];
    unreadNotifications: NotificationWithActionByAndPost[];
    totalNotifications: number;
  }>();
  const [notificationsToAdd, setNotificationsToAdd] = useState(3);
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoadingNotifications, startLoadingNotifications] = useTransition();
  const [isMarkedAllRead, setIsMarkedAllRead] = useState(0);

  useEffect(() => {
    const recentNotifications = async () => {
      startLoadingNotifications(async () => {
        const notifications = await getNotifications(
          "showRecent",
          userId as string,
          notificationsToAdd
        );

        if (notifications) {
          const recentNotifications = notifications.notifications ?? [];
          const totalNotifications = notifications.totalNotifications ?? 0;

          const filteredNotifications =
            recentNotifications?.length > 0
              ? recentNotifications.filter(
                  (notification) => notification.read === false
                )
              : [];

          if (notificationsToAdd >= (notifications?.totalNotifications ?? 0)) {
            setIsScrollEnd(true);
          }

          setNotifications({
            recentNotifications,
            unreadNotifications: filteredNotifications,
            totalNotifications,
          });
        }
      });
    };

    recentNotifications();
  }, [notificationsToAdd, userId, isMarkedAllRead]);

  const setUpdateNotifications = async () => {
    startTransition(async () => {
      await updateNotifications(notifications?.unreadNotifications ?? []);
    });
    isMarkedAllRead === 0 ? setIsMarkedAllRead(1) : setIsMarkedAllRead(0);
  };

  const showNotifications = () => {
    return notifications &&
      (notifications.unreadNotifications.length > 0 ||
        notifications.recentNotifications.length > 0) ? (
      <>
        <section className="m-5 flex items-center justify-between text-nowrap">
          <p className="paragraph-1-bold text-dark-800 dark:text-white-200 ">
            {notifications?.unreadNotifications.length === 1
              ? `${notifications.unreadNotifications.length} Unread Notification`
              : `${notifications?.unreadNotifications.length} Unread Notifications`}
          </p>
          <div className="max-md:hidden">
            <MarkReadButton
              setUpdateNotifications={setUpdateNotifications}
              isUpdating={isPending}
              unreadNotifications={notifications?.unreadNotifications ?? []}
            />
          </div>
        </section>

        <section className="mx-0 mb-6 mt-2 flex flex-col">
          <ScrollController
            onScrollEnd={() => {
              setNotificationsToAdd((curr) => (curr += 3));
            }}
            isScrollEnd={isScrollEnd}
          >
            {notifications?.recentNotifications.map((notification) =>
              notification.type === NotificationType.follow ? (
                <Link
                  href={`/profile/${notification.actionById}`}
                  key={notification.id}
                >
                  <NotificationMenuItem notification={notification} />
                </Link>
              ) : (
                <Link
                  href={`/posts/${notification.postId}`}
                  key={notification.id}
                >
                  <NotificationMenuItem notification={notification} />
                </Link>
              )
            )}
          </ScrollController>
        </section>

        {/* MOBILE VIEW */}
        <div className="mx-6 mb-6 flex md:hidden">
          <MarkReadButton
            setUpdateNotifications={setUpdateNotifications}
            isUpdating={isPending}
            unreadNotifications={notifications?.unreadNotifications ?? []}
          />
        </div>
      </>
    ) : (
      <div className="flex h-40 flex-col justify-center gap-x-2 space-y-2 text-center align-middle">
        <p className="paragraph-3-regular text-white-400 dark:text-white-300">
          You have no notifications
        </p>
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus-ring flex items-center rounded-md bg-white-200 p-3 dark:bg-dark-700"
        aria-label="Notifications"
      >
        <Bell
          status={
            (notifications?.unreadNotifications ?? []).length > 0
              ? "newWithBorder"
              : "none"
          }
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="mt-6 flex w-[385px] flex-col rounded-2xl border border-white-border max-md:w-[347px] dark:border-dark-700 dark:bg-dark-800"
        align="end"
      >
        {isLoadingNotifications ? (
          <div className="flex h-40 flex-col justify-center gap-x-2 space-y-2 text-center align-middle">
            <p className="paragraph-3-regular animate-pulse text-white-400 dark:text-white-300">
              Loading notifications...
            </p>
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-white-400 dark:text-white-300" />
            </div>
          </div>
        ) : (
          showNotifications()
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
