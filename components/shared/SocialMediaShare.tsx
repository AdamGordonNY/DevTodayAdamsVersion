"use client";
import { Copy, CopyIcon, Facebook, Twitter, X, MailIcon } from "lucide-react";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { useCopyToClipboard } from "usehooks-ts";
import CurvedArrows from "../ui/icons/CurvedArrows";
import { DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import clipboard from "@/public/icons/clipboard.svg";
import Image from "next/image";
import LinkedIn from "../ui/icons/LinkedIn";

interface ShareModalProps {
  contentType: string;
}
export const SiteButton = ({ site }: { site: string }) => {
  switch (site) {
    case "linkedin":
      return (
        <LinkedIn className="size-6 place-self-center dark:fill-white-200 dark:stroke-dark-700" />
      );
    case "facebook":
      return (
        <Facebook className="size-6 place-self-center dark:fill-white-200 dark:stroke-dark-700" />
      );
    case "twitter":
      return (
        <Twitter className="size-6 place-self-center dark:fill-white-200 dark:stroke-dark-700" />
      );
    case "email":
      return (
        <CopyIcon className="size-6 place-self-center dark:fill-white-200 dark:stroke-dark-700" />
      );
    case "copyLink":
      return (
        <Copy className="size-6 place-self-center dark:fill-white-200 dark:stroke-dark-700" />
      );
    default:
  }
  return (
    <div className=" flex flex-col gap-y-1.5 align-text-bottom">
      <div className="flex size-64 gap-x-2.5 rounded-[16px] p-5 text-white-200 dark:bg-dark-700">
        <ShareButton contentType="group" />
      </div>
    </div>
  );
};
export const ShareButton = ({ contentType }: ShareModalProps) => {
  const sites = ["linkedin", "facebook", "twitter", "email", "copyLink"];

  const [isCopied, copyToClipboard] = useCopyToClipboard();
  const shareUrl = `https://adam-gordon.info/groups/${contentType.id}`;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <CurvedArrows className="ml-[3px] fill-white-400 dark:fill-white-300" />
          </Button>
        </DialogTrigger>
        <div className="fixed-backdrop flex flex-col">
          <DialogContent className="centered-dialog">
            {/* {Header } */}
            <div className="paragraph-4-medium flex justify-between px-6 py-3.5">
              <div className="p-4">
                <p className="dark:text-white-200">Share</p>
              </div>
              <div className="p-4">
                <DialogClose asChild>
                  <Button>
                    <X className="stroke-dark-800 dark:stroke-white-100" />
                  </Button>
                </DialogClose>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-y-3.5">
              <div className="flex gap-x-8">
                {sites &&
                  sites.map((site) => (
                    <>
                      <SiteButton key={site} site={site} />
                    </>
                  ))}
                <Input value={shareUrl!} className="w-full " />{" "}
                <Button onClick={() => copyToClipboard(shareUrl)}>
                  <Image src={clipboard} alt="copy" className="size-4" />{" "}
                </Button>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};
export default ShareButton;
