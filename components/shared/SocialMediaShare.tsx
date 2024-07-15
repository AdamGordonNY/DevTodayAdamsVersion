"use client";
import { X } from "lucide-react";
import React from "react";

import { useCopyToClipboard } from "usehooks-ts";
import CurvedArrows from "../ui/icons/CurvedArrows";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import clipboard from "@/public/icons/clipboard.svg";
import Image from "next/image";
import message from "@/public/icons/message.svg";
import fb from "@/public/icons/fa-brands_facebook.svg";
import linkedIn from "@/public/icons/li_fill.svg";
import twitter from "@/public/icons/twitter.svg";
import copy from "@/public/icons/copy.svg";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export const ShareButton = () => {
  const sites = ["linkedin", "facebook", "twitter", "email"];
  const pathname = usePathname();
  const { contentId } = useParams();
  // getter , setter
  const [isCopied, copyToClipboard] = useCopyToClipboard();
  const shareUrl = `https://adam-gordon.info/groups/${contentId}`;
  const defaultUrl = `https://adam-gordon.info/${pathname}`;

  const getShareLink = (site: string) => {
    switch (site) {
      case "linkedin":
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20this%20out!`;
      case "email":
        return `mailto:?subject=Check%20this%20out!&body=${encodeURIComponent(shareUrl)}`;
      case "copyLink":
        return shareUrl || defaultUrl;
      default:
        return "";
    }
  };

  const renderSiteButton = (site: string) => (
    <Link
      href={getShareLink(site)}
      target={site !== "copyLink" ? "_blank" : ""}
      rel="noopener noreferrer"
      onClick={
        site === "copyLink"
          ? (e) => {
              e.preventDefault();
              copyToClipboard(getShareLink(site));
            }
          : undefined
      }
      className="flex flex-col items-center justify-center gap-x-2.5"
      key={site}
    >
      <div className="flex size-16 h-[90px] flex-col items-center justify-center rounded-2xl dark:bg-dark-700">
        <Image
          alt={site}
          src={
            site === "linkedin"
              ? linkedIn
              : site === "facebook"
                ? fb
                : site === "twitter"
                  ? twitter
                  : site === "email"
                    ? message
                    : copy
          }
          width={site === "linkedin" ? 64 : 24}
          height={site === "linkedin" ? 64 : 24}
          className="size-6 place-self-center dark:fill-white-200 dark:stroke-dark-700"
        />
      </div>
      <span className="paragraph-3-medium capitalize text-white-200">
        {site}
      </span>
    </Link>
  );

  return (
    <>
      <Dialog modal>
        <DialogTrigger asChild>
          <Button className="size-4 rounded-full bg-white-400">
            <CurvedArrows className="ml-[3px] fill-white-400 dark:fill-white-300" />
          </Button>
        </DialogTrigger>
        <div className="flex ">
          <DialogContent className="z-50 flex h-[337px] w-[450px] flex-col  justify-between gap-x-6 rounded-2xl  bg-dark-800">
            {/* {Header } */}
            <div className="heading-1-medium flex w-full flex-col  justify-between  px-6 py-3.5 text-white-200">
              <div className="flex w-full justify-between">
                {" "}
                <h1 className="dark:text-white-200">Share With </h1>
                <DialogClose asChild>
                  <Button className="bg-transparent">
                    <X className="stroke-dark-800 dark:stroke-white-100" />
                  </Button>
                </DialogClose>
              </div>
            </div>
            {/* {Site buttons} */}
            <div className="flex w-full justify-between">
              <div className="flex w-full justify-around">
                {sites && sites.map((site) => renderSiteButton(site))}
              </div>
            </div>
            <span className="paragraph-4-regular items-center place-self-center dark:text-white-400">
              Or share with Link
            </span>
            {/* {Bottom Row} */}
            <div className="flex w-full align-bottom ">
              <Input value={shareUrl!} readOnly className="flex w-full py-3" />{" "}
              <Button
                onClick={() => copyToClipboard(shareUrl)}
                className="bg-transparent"
              >
                <Image
                  src={clipboard}
                  alt="copy"
                  className="size-4 fill-purple-500"
                />
              </Button>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};
export default ShareButton;
