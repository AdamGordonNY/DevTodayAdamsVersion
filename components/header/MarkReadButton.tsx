import Image from "next/image";
import { Loader2 } from "lucide-react";

import checkmarkLight from "@/public/checkmarkLight.svg";
import checkmarkDark from "@/public/checkmarkDark.svg";
import { NotificationWithActionByAndPost } from "@/lib/types.d";

const MarkReadButton = ({
  setUpdateNotifications,
  isUpdating,
  unreadNotifications,
}: {
  setUpdateNotifications: () => void;
  isUpdating: boolean;
  unreadNotifications: NotificationWithActionByAndPost[];
}) => {
  return (
    <button
      className="mark-all-read"
      type="button"
      onClick={setUpdateNotifications}
      disabled={isUpdating || unreadNotifications.length === 0}
    >
      {isUpdating ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Image
            src={checkmarkLight}
            alt="Checkmark Light Mode"
            className="block dark:hidden"
          />
          <Image
            src={checkmarkDark}
            alt="Checkmark Light Mode"
            className="hidden dark:block"
          />
        </>
      )}
      Mark all as read
    </button>
  );
};

export default MarkReadButton;
