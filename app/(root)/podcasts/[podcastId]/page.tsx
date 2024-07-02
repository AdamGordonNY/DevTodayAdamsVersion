import React from "react";

import { ContentCategoryEnum, PodcastContent } from "@/lib/types.d";
import { getPodcastById } from "@/lib/actions/podcast.actions";

import Error from "@/components/shared/Error";
import ContentNotFound from "@/components/shared/ContentNotFound";
import ContentOverview from "@/components/contentTypes/ContentOverview";

const Podcast = async ({ params }: { params: { podcastId: string } }) => {
  const { podcast, error } = await getPodcastById(params.podcastId);

  if (!podcast) return <ContentNotFound contentCategory="Podcast" />;
  if (error) return <Error contentCategory="Podcast" error={error} />;

  return (
    <ContentOverview
      content={podcast as PodcastContent}
      contentCategoryEnum={ContentCategoryEnum.PODCAST}
      contentCategoryType="Podcast"
    />
  );
};

export default Podcast;
