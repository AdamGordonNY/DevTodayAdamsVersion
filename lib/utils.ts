import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistance } from "date-fns";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import qs from "query-string";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeDifference = (createdAt: Date) => {
  if (!createdAt || isNaN(new Date(createdAt).getTime())) {
    return "Invalid date";
  }

  const todaysDate = new Date();
  const joinedDate = new Date(createdAt);
  const diff = formatDistance(joinedDate, todaysDate, { addSuffix: true });
  return diff;
};
interface URLQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export const formUrlQuery = ({ params, key, value }: URLQueryParams) => {
  const currentURL = qs.parse(params);
  currentURL[key] = value;
  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentURL },
    { skipNull: true }
  );
};
interface RemoveURLQueryParams {
  params: string;
  keysToRemove: string[];
}
export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveURLQueryParams) => {
  const currentURL = qs.parse(params);
  keysToRemove.forEach((key) => delete currentURL[key]);
  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentURL },
    { skipNull: true }
  );
};

export const singularOrPlural = (count: number = 1, pluralizedWord: string) => {
  return count === 1
    ? pluralizedWord.slice(0, pluralizedWord.length - 1)
    : pluralizedWord;
};
