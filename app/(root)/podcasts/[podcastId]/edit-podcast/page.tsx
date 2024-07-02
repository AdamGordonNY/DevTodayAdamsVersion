import CreateOrEditPodcast from "@/components/contentTypes/CreateOrEditPodcast";
import { getPodcastById } from "@/lib/actions/podcast.actions";
import { isUserAuthor } from "@/lib/actions/user.actions";
import { PodcastContent } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";
export const dynamic = "force-dynamic";
const Page = async ({ params }: { params: { podcastId: string } }) => {
  const podcast = await getPodcastById(params.podcastId);
  const { isAuthor } = await isUserAuthor(podcast?.podcast?.userId as number);

  if (!isAuthor) redirect("/");
  return <CreateOrEditPodcast podcast={podcast.podcast as PodcastContent} />;
};

export default Page;
