import { Levels, Tech, Goals, SocialMedia, User } from "@prisma/client";
import { ContentCategoryEnum } from "../types";

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
  memberCount: number;
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
export interface ParamsProps {
  params: { id: string };
}
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
  podcastCount: number;
  meetupCount: number;
  totalCount: number;
  coverImage?: string;
}
export interface TopRankUsers {
  id: number;
  username: string;
  image: string | null;
  firstName: string;
  lastName: string;
  lastActivity: Date;
}
