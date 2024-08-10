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
import { Totals, UserWithProfileContent } from "./actions/shared.types";
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
  groupUsers: {
    id: number;
    image: string | null;
    role: string;
    username: string;
  }[];
};
export type GroupOverviewContent = {
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
  totals: Totals;
  groupUsers: {
    id: number;
    image: string | null;
    role: string;
    username: string;
  }[];
  user: User & { role: Role };
};
export type GroupUserAndRole = {
  user: User;
  following: User[];
  followers: User[];
  role: Role;
};

export type GroupContent = Prisma.GroupGetPayload<{
  include: {
    createdBy: true;
    groupUsers: { include: { user: true; role: true; image: true } }[];
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
export type GroupLoggedInUser = User & {
  following: User[];
  followers: User[];
  role: Role;
};
export type GroupRightSidebarContent = {
  meetups: Meetup[];
  groupUsers: {
    userId: number;
    user: User;
    role: Role;
    image: string | null;
  }[];

  user: User;
  role: Role;
};

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

export type ContentMetrics = {
  id: number;
  type: string;
  title: string;
  views: number;
  likes: number;
  comment_count: number;
  image: string;
};
