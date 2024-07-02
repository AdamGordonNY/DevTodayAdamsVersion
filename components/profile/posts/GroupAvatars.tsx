import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
interface GroupAvatarsProps {
  members:
    | {
        id: number | undefined | null;
        image: string | undefined;
      }[]
    | undefined
    | null;

  count?: number;
}

const GroupAvatars = ({ members, count }: GroupAvatarsProps) => {
  if (members && members.length === 0) {
    return null;
  }

  const remaining = count! - members?.length! || null;

  return (
    <section className="flex max-w-[105px]">
      {members?.map((member, index) => (
        <div key={index} className="w-[18px]">
          <Avatar
            key={member.id}
            className="bg-#E8E1FF size-[30px] dark:bg-white-100"
          >
            <AvatarImage
              src={member.image}
              alt="avatar"
              className="m-[3px] size-[24px] items-center rounded-full"
            />
          </Avatar>
        </div>
      ))}
      {remaining! > 0 && (
        <Avatar className="paragraph-4-regular flex size-[30px] items-center justify-center">
          <AvatarFallback className="size-full bg-primary-100 dark:bg-dark-700 dark:text-white-100">
            +{remaining}
          </AvatarFallback>
        </Avatar>
      )}
    </section>
  );
};

export default GroupAvatars;
