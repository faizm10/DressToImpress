import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

export const shoppingCategories = [
  // "All",
  // "Lighting",
  // "Kitchenware",
  // "Home Decor",
  // "Plants",
  // "Office",
  // "Textiles",
];

export const categories = {
  women: ["Dresses", "Tops", "Bottoms", "Outerwear", "Accessories"],
  men: ["Shirts", "Pants", "Outerwear", "Shoes", "Accessories"],
};
export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Admin",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Upload",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Edit",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Delete",
      url: "#",
      icon: IconDashboard,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};
