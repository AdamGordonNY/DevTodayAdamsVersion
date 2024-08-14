import {
  Levels,
  Tech,
  Goals,
  SocialMedia,
  User,
  GroupUser,
  Prisma,
  Like,
} from "@prisma/client";
import { ContentCategoryEnum } from "../types";

export type Option = {
  key: Levels | Tech | Goals;
  value: string;
};
export type UserContent = Prisma.UserGetPayload<{
  include: {
    followers: true;
    following: true;
    posts: true;
    podcasts: true;
    meetups: true;
    groups: true;
  };
}>;

export type Step = {
  heading: string;
  options: Option[];
};

export type OnboardingOptions = {
  step: {
    [key: string]: Step;
  };
};
export interface ProfilePost {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  likes: number;
  views: number;
  image: string | null;
  commentCount: number;
  updatedAt: Date | null;
  tags: string[];
}

export interface ProfilePodcast {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  likes: number;
  views: number;
  image: string | null;
  commentCount: number;
  updatedAt: Date | null;
  tags: string[];
  audio: string;
  groupId: number;
  userId: number;
}

export interface ProfileMeetup {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  likes: number;
  views: number;
  image: string | null;
  commentCount: number;
  startTime: Date | null;
  address: string;
  updatedAt: Date | null;
  tags: string[];
}
export interface ProfileGroup {
  id: number;
  name: string;
  about: string;
  coverImage: string | null;
  members: {
    id: number;
    image: string | null;
  }[];

  createdAt: Date;
  groupUsers: GroupUser[];
}
export interface UserWithProfileContent {
  id: number;
  clerkID: string;
  createdAt: Date;
  username: string | null;
  email: string;
  firstName: string;
  lastName: string;
  level: Levels;
  goals: Goals;
  bio: string | null;
  image: string | null;
  posts: ProfilePost[];
  onboardingStep: number | null;
  tech: Tech[];
  podcasts: ProfilePodcast[];
  meetups: ProfileMeetup[];
  SocialMedia: SocialMedia[];
  followers: User[];
  following: User[];
  groups: ProfileGroup[];
}
export type LikedContent = {
  liked: boolean;
  message: string;
  error: any;
  likes: number;
  contentCategory: ContentCategoryEnum;
};

export interface SearchParamsProps {
  filter: any;
  searchParams: { [key: string]: string | undefined };
}
export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface TopRankGroups {
  id: number;
  name: string;
  postCount: number;
  coverImage?: string;
  members?: GroupUser[];
  admins?: GroupUser[];
}

export type GroupWithDetails = Prisma.GroupGetPayload<{
  include: {
    posts: {
      include: {
        comment: true;
        _count: {
          select: {
            comment: true;
          };
        };
        user: {
          select: {
            id: true;
            username: true;
            image: true;
          };
        };
      };
    };
    podcasts: {
      include: {
        comment: true;
        _count: {
          select: {
            comment: true;
          };
        };
        user: {
          select: {
            id: true;
            username: true;
            image: true;
          };
        };
      };
    };
    meetups: {
      include: {
        comment: true;
        _count: {
          select: {
            comment: true;
          };
          user: {
            select: {
              id: true;
              username: true;
              image: true;
            };
          };
        };
      };
      groupUsers: {
        include: {
          user: {
            select: {
              id: true;
              username: true;
              image: true;
              followers: true;
              following: true;
            };
          };
        };
      };
    };
  };
}>;
export type GroupUserWithFollowDetails = {
  id: number;
  username: string | null;
  image: string | null;
  following: User[];
  followers: User[];
  clerkID?: string | null;
};

export type PostContent = {
  [x: string]: number;
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  _count: {
    comment: number;
  };
  postCount: number;
  user: {
    id: number;
    username: string | null;
    image: string | null;
  };
};
export type GroupUserContent = {
  id: number;
  groupId: number;
  userId: number;
  role?: string;
  createdAt: Date;
  user: {
    id: number;
    username: string | null;
    image: string | null;
    followers: { id: number }[];
    following: { id: number }[];
  };
};
export type PodcastContent = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  audioTitle: string;
  _count: {
    comment: number;
  };
  user: {
    id: number;
    username: string | null;
    image: string | null;
  };
};

export type MeetupContent = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  _count: {
    comment: number;
  };
  startTime: Date | null;
  endTime: Date | null;
  image: string;
  address: string;
  comment: Comment[];
  likes: number;
  groupId: number;
  userId: number;
  likedBy: Like[];
  longitude: number;
  latitude: number;
  tags: string[];
  user?: {
    id: number;
    username: string | null;
    image: string | null;
  };
};

export type GroupOwnerContent = {
  id: number;
  username: string | null;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
};

export type LoggedInUserContent = {
  id: number;
  username: string | null;
  image: string | null;
  following: { id: number }[];
  followers: { id: number }[];
  clerkID: string;
  role: "ADMIN" | "OWNER" | "MEMBER" | "GUEST";
};
export type GroupDetailsResult = {
  group: {
    id: number;
    createdAt: Date;
    name: string;
    coverImage: string | null;
    profileImage: string | null;
    about: string;
    createdBy: number;
    posts: {
      id: number;
      title: string;
      body: string;
      createdAt: Date;
      _count: {
        comment: number;
      };
      user: {
        id: number;
        username: string | null;
        image: string | null;
      };
    }[];
    groupUsers: GroupUserContent[] | undefined;
    podcasts: {
      id: number;
      title: string;
      body: string;
      createdAt: Date;
      _count: {
        comment: number;
      };
      user: {
        id: number;
        username: string | null;
        image: string | null;
      };
    }[];
    meetups: {
      id: number;
      title: string;
      body: string;
      createdAt: Date;
      startTime: Date | null;
      endTime: Date | null;
      address: string;
      _count: {
        comment: number;
      };
      user: {
        id: number;
        username: string | null;
        image: string | null;
      };
    }[];
  };

  adminsAndOwners: GroupUserWithFollowDetails[];
  members: GroupUserWithFollowDetails[];
  totalMembersCount: number | undefined;
  isAdminOrOwner: boolean | undefined;
  loggedInUser: LoggedInUserContent | null;
  owner: GroupOwnerContent | null;
};
