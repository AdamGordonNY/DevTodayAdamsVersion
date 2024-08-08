/* eslint-disable no-unused-vars */
import {
  Meetup,
  Podcast,
  Post,
  Group,
  User,
  Notification,
  Prisma,
  GroupUser,
  Role,
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
  coverImage: string;
  about: string;
  _count: {
    posts: number;
    podcasts: number;
    meetups: number;
    groupUsers: number;
  };
  createdByUser: {
    id: number;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  groupUsers: {
    id: number;
    image: string | null;
    role: string;
  }[];
};
export type GroupContent = Prisma.GroupGetPayload<{
  include: {
    createdBy: true;
    groupUsers: { select: { user: true; role: true } };
    _count: {
      select: {
        posts: true;
        podcasts: true;
        meetups: true;
        groupUsers: true;
      };
    };
    posts: true;
    podcasts: true;
    meetups: true;
  };
}>;

export type GroupUserContent = Prisma.GroupUserGetPayload<{
  include: {
    user: true;
    group: true;
    role: true;
  };
}>[];
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
