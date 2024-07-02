import {
  Calendar,
  Followers,
  Layers,
  Podcasts,
  Logout,
  Profile,
} from "@/components/ui/icons";
import { Levels, Tech, Goals } from "@prisma/client";
import { OnboardingOptions } from "./actions/shared.types";

export const middleHeaderIconList = [
  {
    icon: Layers,
    key: "posts",
  },
  {
    icon: Calendar,
    key: "meetups",
  },
  {
    icon: Podcasts,
    key: "podcasts",
  },
  {
    icon: Followers,
    key: "groups",
  },
];

export const clerkMenuItems = [
  {
    icon: Profile,
    label: "Profile",
  },
  {
    icon: Logout,
    label: "Logout",
  },
];
export const createMenuItems = [
  { label: "Create Post", key: "post", route: "/posts/create-post" },
  { label: "Create Meetup", key: "meetup", route: "/meetups/create-meetup" },
  {
    label: "Create Podcast",
    key: "podcast",
    route: "/podcasts/create-podcast",
  },
];
export const onboardingOptions: OnboardingOptions = {
  step: {
    "1": {
      heading: "Which best describes our current programming journey?",
      options: [
        {
          key: Levels.SeasonedPro,
          value: "Seasoned Pro - Coding Veteran",
        },
        {
          key: Levels.LearningEnthusiast,
          value: "Learning Enthusiast - Continuous Learner",
        },
        {
          key: Levels.ProjectExplorer,
          value: "Project Explorer -Passionate Builder",
        },
        {
          key: Levels.TechStudent,
          value: "Tech Student - Studying Programming",
        },
        {
          key: Levels.TechExplorer,
          value: "Tech Explorer - New to coding, eager to learn",
        },
      ],
    },
    "2": {
      heading: "Define Your Coding Ambitions",
      options: [
        {
          key: Goals.BuildPortfolio,
          value: "Build Portfolio - showcase projects",
        },
        {
          key: Goals.OpenSource,
          value: "Open Source Contributor - make your mark",
        },
        {
          key: Goals.NewLanguage,
          value: "Master a New Language - Learn and Conquer",
        },
        {
          key: Goals.SideProject,
          value: "Launch Side Project - Bring ideas to life",
        },
        {
          key: Goals.CodingEvents,
          value: "Attend Coding Events - Network and learn",
        },
      ],
    },
    "3": {
      heading: "What frameworks and languages are you interested in?",
      options: [
        { key: Tech.react, value: "React.js" },
        { key: Tech.html5, value: "HTML5" },
        { key: Tech.js, value: "Javascript(ES6+)" },
        { key: Tech.css, value: "CSS 3" },
        { key: Tech.node, value: "Node.js" },
        { key: Tech.vue, value: "Vue.js" },
        { key: Tech.angular, value: "Angular" },
        { key: Tech.mongodb, value: "Mongo.db" },
        { key: Tech.graphql, value: "GraphQL" },
        { key: Tech.next, value: "Next.js 14" },
        { key: Tech.d3, value: "D3.js" },
        { key: Tech.typescript, value: "Typescript" },
        { key: Tech.three, value: "Threejs" },
        { key: Tech.express, value: "Express.js" },
      ],
    },
  },
};

export const signUpItems = {
  page: "/sign-up",
  text: "Join Our Developer Community! Sign up now and participate in the conversation.",
  items: [
    {
      text: "Discover the latest trends,tools, and insights that shape the developer world.",
      icon: "business",
    },
    {
      text: "Forge connections, collaborate on projects, and grow together.",
      icon: "feedback",
    },
    {
      text: "Elevate your coding with exclusive content for professional growth.",
      icon: "inbox-blue",
    },
  ],
};
export const signInItems = {
  page: "/sign-in",
  text: "Sign in to DevToday.",
  items: [
    {
      text: "Get in the code zone quickly! Swift sign-in for instant access to your hub",
      icon: "inbox",

      page: "/sign-in",
    },
    {
      text: "Trouble Logging in? Reset your password",
      icon: "lightning",

      page: "/sign-in",
    },
  ],
};

export const onboardingItems = {
  page: "/onboarding",
  text: "Tell us a little bit about yourself!",
  items: [
    {
      text: "Highlight your skills and projects for the community.",
      icon: "rocket",
      step: 1,
      page: "/onboarding",
    },
    {
      text: "Explore Learning Opportunities and connect with mentors",
      icon: "feedback",
      step: 1,
      page: "/onboarding",
    },
    {
      text: "Outline your coding journey by setting ambitious and achievable goals",
      icon: "rocket",
      step: 2,
      page: "/onboarding",
    },
    {
      text: "Share your coding triumphs and achievements with the community",
      icon: "feedback",
      step: 2,
      page: "/onboarding",
    },
    {
      text: "Paint your coding canvas by selecting your favorite language & frameworks.",
      icon: "rocket",
      step: 3,
      page: "/onboarding",
    },
    {
      text: "Choose tools that define your coding style and shape your dev journey.",
      icon: "feedback",
      step: 3,
      page: "/onboarding",
    },
  ],
};
export const actionButtonItems = [
  {
    text: "Posts",
    key: "posts",
    route: "/posts",
  },
  {
    text: "Meetups",
    key: "meetups",
    route: "/meetups",
  },

  {
    text: "Podcasts",
    key: "podcasts",
    route: "/podcasts",
  },
  {
    text: "Groups",
    key: "groups",
    route: "/groups",
  },
];
export const sidebarButtons = [
  {
    label: "Newest",
    key: "newest",
    value: "newest",
  },
  {
    label: "Popular",
    key: "popular",
    value: "popular",
  },
  {
    label: "Following",
    key: "following",
    value: "following",
  },
];
export const groupSidebarButtons = [
  {
    label: "Newest",
    key: "newest",
    value: "newest",
  },
  {
    label: "Popular",
    key: "popular",
    value: "popular",
  },
  {
    label: "Joined",
    key: "joined",
    value: "joined",
  },
];
