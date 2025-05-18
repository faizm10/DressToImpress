import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconPlus,
  IconRecordMail
} from "@tabler/icons-react";
export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Student's Attire",
      url: "/students-record",
      icon: IconRecordMail,
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
};

export const shoppingCategories = [
  // "All",
  // "Lighting",
  // "Kitchenware",
  // "Home Decor",
  // "Plants",
  // "Office",
  // "Textiles",
];
export const menCategories = [
  "Dress Pants",
  " Dress Shirts",
  "Suit Jackets",
  "Suits",
  "Shoes",
  "Ties",
];

export const womenCategories = [
  "Blazers",
  "Blouses & Tops",
  "Cardigans",
  "Dresses",
  "Jackets",
  "Pants",
  "Skirts",
  "Pant Suits",
  "Shoes",
  "Bags",
];
// export const categories = {
//   women: ["Dresses", "Tops", "Bottoms", "Outerwear", "Accessories"],
//   men: ["Shirts", "Pants", "Outerwear", "Shoes", "Accessories"],
// };
