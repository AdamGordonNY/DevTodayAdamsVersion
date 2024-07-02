import React from "react";

import { ContentCategoryEnum, MeetupContent } from "@/lib/types.d";
import { getMeetupById } from "@/lib/actions/meetup.actions";

import Error from "@/components/shared/Error";
import ContentNotFound from "@/components/shared/ContentNotFound";
import ContentOverview from "@/components/contentTypes/ContentOverview";

// Forcing component to be dynamic rather than using cache in order to show immediate updates without a refresh
export const dynamic = "force-dynamic";

const Meetup = async ({ params }: { params: { meetupId: string } }) => {
  const { meetup, error } = await getMeetupById(params.meetupId);

  if (!meetup) return <ContentNotFound contentCategory="Meetup" />;
  if (error) return <Error contentCategory="Meetup" error={error} />;

  return (
    <ContentOverview
      content={meetup as MeetupContent}
      contentCategoryEnum={ContentCategoryEnum.MEETUP}
      contentCategoryType="Meetup"
    />
  );
};

export default Meetup;
