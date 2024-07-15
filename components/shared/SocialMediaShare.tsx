"use client";
import { X } from "lucide-react";
import React from "react";

import { useCopyToClipboard } from "usehooks-ts";
import { Share } from "../ui";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
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
import { usePathname } from "next/navigation";
import Link from "next/link";

export const ShareButton = () => {
  const sites = ["linkedin", "facebook", "twitter", "email"];
  const pathname = usePathname();

  const [isCopied, copyToClipboard] = useCopyToClipboard();

  const defaultUrl = `https://adam-gordon.info${pathname}`;
  const paths = ["/groups", "/posts", "/podcasts", "/meetups", "/users"];
  const getShareLink = (site: string) => {
    switch (site) {
      case "linkedin":
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(defaultUrl)}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(defaultUrl)}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(defaultUrl)}&text=Check%20this%20out!`;
      case "email":
        return `mailto:?subject=Check%20this%20out!&body=${encodeURIComponent(defaultUrl).toString()}`;
      case "copyLink":
        return defaultUrl;
      default:
        return "https://adam-gordon.info";
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
      <div className="flex size-16 h-[90px] flex-col items-center justify-center rounded-2xl bg-white-400 dark:bg-dark-700">
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
          className="size-6 place-self-center fill-dark-700 stroke-white-400  dark:fill-white-200 dark:stroke-dark-700"
        />
      </div>
      <span className="paragraph-3-medium capitalize text-dark-900 dark:text-white-200">
        {site}
      </span>
    </Link>
  );

  return (
    <>
      <Dialog modal>
        <DialogTrigger asChild>
          {paths.includes(pathname) ? (
            <button
              type="button"
              className="paragraph-3-medium flex items-center justify-center gap-x-2 rounded-full bg-[#C5D0E666] p-2.5  dark:bg-dark-700"
            >
              <Share size={14} fill="fill-dark-700 dark:fill-white-300" />
            </button>
          ) : (
            <button
              type="button"
              className="paragraph-3-medium flex items-center justify-center gap-x-2 rounded bg-[#C5D0E666] p-2.5  dark:bg-dark-700"
            >
              <Share size={14} fill="fill-dark-700 dark:fill-white-300" />

              <p className="text-dark-700 dark:text-white-300">Share Post</p>
            </button>
          )}
        </DialogTrigger>
        <div className="flex w-full ">
          <DialogContent className="z-50 flex h-[337px] flex-col justify-between gap-x-6 rounded-2xl bg-white-100 px-6  py-3.5 max-md:w-[90%] md:w-[450px]  dark:bg-dark-800">
            {/* {Header } */}
            <DialogHeader className="heading-1-medium flex w-full flex-row justify-between   text-dark-800 dark:text-white-200">
              <h1 className="dark:text-white-200">Share With </h1>
              <DialogClose asChild className="">
                <button type="button" className="bg-transparent">
                  <X className="stroke-dark-800 dark:stroke-white-100" />
                </button>
              </DialogClose>
            </DialogHeader>

            {/* {Site buttons} */}
            <div className="flex w-full justify-between">
              <div className="flex h-[90px] w-full justify-around gap-x-9">
                {sites && sites.map((site) => renderSiteButton(site))}
              </div>
            </div>
            <span className="paragraph-4-regular items-center place-self-center text-dark-900 dark:text-white-400">
              Or share with Link
            </span>
            {/* {Bottom Row} */}
            <div className="flex w-full rounded-md bg-white-200  align-bottom  text-dark-900 ring-0 dark:bg-dark-700 dark:text-white-200 ">
              <Input
                value={isCopied || defaultUrl}
                readOnly
                className="paragraph-3-medium flex w-full rounded-none bg-white-200 py-3 text-dark-900 ring-0 focus:border-0 focus:ring-0 dark:bg-dark-700 dark:text-white-200"
              />{" "}
              <Button
                onClick={() => copyToClipboard(defaultUrl)}
                className="bg-transparent"
              >
                <Image
                  src={clipboard}
                  alt="copy"
                  className="size-4 stroke-purple-500 dark:fill-purple-500"
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
