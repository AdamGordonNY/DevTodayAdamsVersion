/* eslint-disable no-unused-vars */
import {
  Meetup,
  Podcast,
  Post,
  Group,
  User,
  Notification,
  Prisma,
} from "@prisma/client";
import { UserWithProfileContent } from "./actions/shared.types";
export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

interface NotificationActionByAndPost {
  actionBy: {
    firstName: string;
    lastName: string;
    image: string | null;
  };
  post?: {
    id: number;
    title: string;
  } | null;
}

export type NotificationWithActionByAndPost = Notification &
  NotificationActionByAndPost;

export type ContentItemType = {
  type: string;
  id: number;
  title: string;
  body: string;
};

export type ContentCategoryType =
  | "Post"
  | "Podcast"
  | "Meetup"
  | "Comment"
  | "Group"
  | "User";

export enum ContentCategoryEnum {
  POST,
  PODCAST,
  MEETUP,
  COMMENT,
}
export type FollowingUserContent = Prisma.UserGetPayload<{
  include: {
    following: true;
    SocialMedia: true;
    posts: true;
    meetups: true;
    podcasts: true;
    groups: true;
    notifications: true;
  };
}>;
export type PostContent = Prisma.PostGetPayload<{
  include: {
    comment: {
      include: {
        author: true;
      };
    };
    user: {
      include: {
        posts: true;
        meetups: true;
        podcasts: true;
        followers: true;
      };
    };
    group: true;
  };
}>;
export type MeetupContent = Prisma.MeetupGetPayload<{
  include: {
    comment: {
      include: {
        author: true;
      };
    };
    user: {
      include: {
        posts: true;
        meetups: true;
        podcasts: true;
        followers: true;
      };
    };
    group: true;
  };
}>;
export type PodcastContent = Prisma.PodcastGetPayload<{
  include: {
    comment: {
      include: {
        author: true;
      };
    };
    user: {
      include: {
        posts: true;
        meetups: true;
        podcasts: true;
        followers: true;
      };
    };
    group: true;
  };
}>;
export type GroupCardContent = {
  id: number;
  name: string;
  coverImage: string | null;
  about: string;
  _count: {
    posts: number;
    podcasts: number;
    meetups: number;
    members: number;
    admins: number;
  };
  admins: { id: number; image: string | null }[];
  members: { id: number; image: string | null }[];
  users: {
    id: number;
    image: string | null;
    username: string | null;
  }[];
};
export type GroupContent = Prisma.GroupGetPayload<{
  include: {
    author: true;
    meetups: true;
    admins: true;
    members: true;
    _count: {
      select: {
        posts: true;
        members: true;
        admins: true;
      };
    };
  };
}>;

export type ContentType = PostContent | MeetupContent | PodcastContent;

export type GroupTabContent = GroupContent & {
  posts: PostContent[];
  podcasts: PodcastContent[];
};
export type GroupTagContent = Group & {
  postCount: number;
};
export type MemberIsAdmin = {
  isAdmin?: boolean;
} & User;

export type SelectedGroupUsers = {
  firstName: string;
  lastName: string;
  id: number;
  image?: string;
};

export type GroupLoggedInUser = User & {
  following: User[];
};

export type ContentMetrics = {
  id: number;
  type: string;
  title: string;
  views: number;
  likes: number;
  comment_count: number;
  image: string;
};
