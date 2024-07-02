import React from "react";
import Image from "next/image";
import blueInbox from "@/public/icons/inbox.svg";
import business from "@/public/icons/business.svg";
import feedback from "@/public/icons/feedback.svg";
import lightning from "@/public/icons/trouble.svg";
import greenInbox from "@/public/icons/grn-inbox.svg";
import rocket from "@/public/icons/rocket.svg";

interface ItemsProps {
  text: string;
  icon: string;
}
const Items = ({ text, icon }: ItemsProps) => {
  let iconPath;
  if (icon === "business") {
    iconPath = business;
  }
  if (icon === "inbox-blue") {
    iconPath = blueInbox;
  }
  if (icon === "lightning") {
    iconPath = lightning;
  }
  if (icon === "feedback") {
    iconPath = feedback;
  }
  if (icon === "inbox") {
    iconPath = greenInbox;
  }
  if (icon === "rocket") {
    iconPath = rocket;
  }
  return (
    <div className="flex h-[100px]  items-center justify-between space-y-2.5 rounded-[8px] bg-dark-700  p-5 align-middle">
      <div className="flex  items-center justify-center gap-5   ">
        <div className="min-h-[60px] min-w-[60px] content-center items-center justify-center rounded-[8px] bg-dark-800 ">
          <div className="flex flex-1 items-center justify-center ">
            <Image alt="icon" src={iconPath!} width={20} height={20} />
          </div>
        </div>

        <h1 className="paragraph-1-medium text-white-100">{text}</h1>
      </div>
    </div>
  );
};

export default Items;
