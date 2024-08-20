import React from "react";
import { getDynamicPosts } from "@/lib/actions/post.actions";
import Pagination from "../shared/Pagination";
import PostCard from "../profile/posts/PostCard";
import { getDynamicMeetups } from "@/lib/actions/meetup.actions";
import MeetupCard from "../profile/posts/MeetupCard";
import { getDynamicPodcasts } from "@/lib/actions/podcast.actions";
import PodcastCard from "../profile/posts/PodcastCard";
import {
  getDynamicGroups,
  getTopActiveUsers,
} from "@/lib/actions/group.actions";
import GroupCard from "@/components/profile/posts/GroupCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { GroupLoggedInUser } from "@/lib/types";
import ActiveMemberCard from "@/components/home/ActiveMembersCard";

interface HomeContentProps {
  type: "meetups" | "posts" | "podcasts" | "groups";
  query?: "newest" | "popular" | "following" | "joined";
  currentPage: number;
}
const HomeContent = async ({
  type,
  query = "newest",
  currentPage,
}: HomeContentProps) => {
  const uid = await auth().userId!;
  const { user } = await getUser(uid);

  const renderNotFollowing = async () => {
    const { users } = await getTopActiveUsers();
    const loggedInUser = user as GroupLoggedInUser;

    return (
      <div className="flex flex-col items-center justify-center gap-3 text-dark-900 dark:text-white-100">
        <h1 className="display-1-bold align-top">
          {" "}
          You are not Following anyone.{" "}
        </h1>
        <span> Check out these Active Users for people to follow! </span>
        {users?.length > 0 &&
          users.map((usr) => (
            <ActiveMemberCard
              key={usr.id}
              user={usr}
              loggedInUser={loggedInUser}
            />
          ))}
      </div>
    );
  };
  const renderContent = async () => {
    if (query === "following" && user?.following.length === 0) {
      return renderNotFollowing();
    }

    switch (type) {
      case "posts":
        const { posts, totalPages } = await getDynamicPosts(
          currentPage,
          query,
          4
        );

        if (posts?.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center">
              <h1 className="display-1-bold align-top dark:text-white-100">
                {" "}
                No Posts to Show.{" "}
              </h1>
            </div>
          );
        }

        return (
          <div className="flex min-h-screen w-full flex-1 flex-col gap-y-[20px] max-lg:py-5">
            {posts?.map((post, idx) => (
              <PostCard
                key={post.id}
                index={idx}
                post={post}
                userData={post?.user!}
              />
            ))}
            <div className="mt-5 flex justify-center">
              <Pagination totalPages={totalPages!} currentPage={currentPage} />
            </div>
          </div>
        );

      case "meetups":
        const meetups = await getDynamicMeetups(currentPage, query, 4);

        if (meetups?.meetups.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center">
              <h1 className="display-1-bold align-top dark:text-white-100">
                {" "}
                No Meetups to Show.{" "}
              </h1>
            </div>
          );
        }

        return (
          <div className="flex min-h-screen w-full flex-1 flex-col gap-y-[20px] max-lg:py-5">
            {meetups?.meetups.map((meetup, idx) => (
              <MeetupCard key={meetup.id} index={idx} meetup={meetup} />
            ))}
            <div className="mt-5 flex justify-center">
              <Pagination
                totalPages={meetups?.totalPages!}
                currentPage={currentPage}
              />
            </div>
          </div>
        );

      case "podcasts":
        const podcasts = await getDynamicPodcasts(currentPage, query, 6);

        if (podcasts?.podcasts.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center">
              <h1 className="display-1-bold align-top dark:text-white-100">
                {" "}
                No Podcasts to Show.{" "}
              </h1>
            </div>
          );
        }

        return (
          <div className="flex w-full flex-1 flex-col">
            <div className="columns-2 space-y-4 max-lg:mt-4 max-lg:columns-1">
              {podcasts?.podcasts.map((podcast, idx) => (
                <PodcastCard
                  key={podcast.id}
                  user={podcast.user}
                  podcast={podcast}
                  index={idx}
                />
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              <Pagination
                totalPages={podcasts?.totalPages!}
                currentPage={currentPage}
              />
            </div>
          </div>
        );

      case "groups":
        if (
          type === "groups" &&
          query === "joined" &&
          user?.groups.length === 0
        ) {
          return (
            <div className="flex flex-col items-start justify-center">
              <h1 className="display-1-bold align-top dark:text-white-100">
                {" "}
                You are not in Any Groups.{" "}
              </h1>
            </div>
          );
        }
        const groupsData = await getDynamicGroups(currentPage, query, 4);

        const formattedGroups = groupsData?.groups?.map((group) => ({
          ...group,
          _count: {
            posts: group._count.posts || 0,
            podcasts: group._count.podcasts || 0,
            meetups: group._count.meetups || 0,
            members: group._count.members || 0,
            admins: group._count.admins || 0,
          },
          users: [...group.admins, ...group.members],
        }));

        return (
          <div className="flex w-full flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between max-lg:my-4">
              <span className="display-2-bold dark:text-white-100">
                All Groups
              </span>

              <Button
                title="Create a New Group"
                className="paragraph-3-bold max-lg:paragraph-4-medium  h-9 rounded-sm bg-primary-500 hover:scale-105 max-lg:h-8"
              >
                <Link href={`/groups/create-group`}>Create a New Group</Link>
              </Button>
            </div>
            <div className="columns-2 gap-x-5 space-y-5 max-md:columns-1">
              {formattedGroups?.map((group) => (
                <GroupCard
                  group={group}
                  key={group.id}
                  userCount={group.users.length}
                  profile={group.members.map((member: any) => ({
                    id: member.id,
                    image: member.image,
                  }))}
                />
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              <Pagination
                totalPages={groupsData?.totalPages!}
                currentPage={currentPage}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <>{await renderContent()}</>;
};

export default HomeContent;
