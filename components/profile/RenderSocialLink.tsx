import React from "react";
import LinkedIn from "../ui/icons/LinkedIn";
import Twitter from "../ui/icons/Twitter";
import Instagram from "../ui/icons/Instagram";
import { Platform } from "@prisma/client";
const RenderSocialLink = ({ socialMedia }: any) => {
  const socialMediaIcons = {
    LinkedIn: <LinkedIn size={24} />,
    Twitter: <Twitter size={24} />,
    Instagram: <Instagram size={24} />,
  } as any;

  return (
    <div className="flex flex-row space-x-4">
      {Object.values(Platform).map((platform) => {
        const link = socialMedia.find(
          (s: any) => s.platform === platform
        )?.link;
        if (link) {
          return (
            <a
              key={platform}
              href={link}
              target="_blank"
              className="hover:opacity-80"
            >
              {socialMediaIcons[platform]}
            </a>
          );
        }
        return null;
      })}
    </div>
  );
};

export default RenderSocialLink;
