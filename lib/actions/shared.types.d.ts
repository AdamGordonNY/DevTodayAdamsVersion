import {
  Levels,
  Tech,
  Goals,
  SocialMedia,
  User,
  GroupUser,
} from "@prisma/client";
import { ContentCategoryEnum, RoleEnum } from "../types";

export type Option = {
  key: Levels | Tech | Goals;
  value: string;
};

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
export type GroupUserFields = {
  id: number;
  username: string | null;
  image: string | null;
  followers: User[];
  following: User[];
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
    groupUsers: GroupUserContent[];
    posts: PostContent[];
    podcasts: PodcastContent[];
    meetups: MeetupContent[];
  };
  posts: PostContent[];
  podcasts: PodcastContent[];
  meetups: MeetupContent[];
  adminsAndOwners: {
    id: number;
    username: string | null;
    image: string | null;
    followers: User[];
    following: User[];
  }[];
  members: {
    id: number;
    username: string | null;
    image: string | null;
    followers: User[];
    following: User[];
  }[];
  totalMembersCount: number;
  isAdminOrOwner: boolean;
  loggedInUser: LoggedInUserContent;
  loggedInUserRole: RoleEnum;
  owner: GroupOwnerContent;
};

export type GroupUserContent = {
  id: number;
  groupId: number;
  userId: number;
  role: string;
  createdAt: Date;
  user: GroupUserFields;
};

export type PostContent = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  views: number;
  image: string | null;
  tags: string[];
  commentCount: number;
  userId: number;
  user: {
    id: number;
    username: string | null;
    image: string | null;
  };
};

export type PodcastContent = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  views: number;
  image: string | null;
  tags: string[];
  commentCount: number;
  audio: string;
  userId: number;
  groupId: number;
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
  updatedAt: Date | null;
  likes: number;
  views: number;
  image: string | null;
  commentCount: number;
  startTime: Date | null;
  address: string;
  userId: number;
  groupId: number;
  tags: string[];
  user: {
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
  following: User[];
  followers: User[];
};

export type LoggedInUserContent = {
  id: number;
  clerkID: string | null;
  createdAt: Date;
  username: string | null;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  following: {
    id: number;
  }[];
  followers: {
    id: number;
  }[];
};
