import { redirect } from "next/navigation";
import React from "react";

import CreateOrEditMeetup from "@/components/contentTypes/CreateOrEditMeetup";
import { getMeetupById } from "@/lib/actions/meetup.actions";
import { isUserAuthor } from "@/lib/actions/user.actions";
import { MeetupContent } from "@/lib/types.d";

// Forcing component to be dynamic rather than using cache in order to show immediate updates without a refresh
export const dynamic = "force-dynamic";

const EditMeetupWrapper = async ({
  params,
}: {
  params: { meetupId: string };
}) => {
  const meetup = await getMeetupById(params.meetupId);
  const { isAuthor } = await isUserAuthor(meetup?.meetup?.userId as number);

  if (!isAuthor) redirect("/");

  return <CreateOrEditMeetup meetup={meetup.meetup as MeetupContent} />;
};

export default EditMeetupWrapper;
