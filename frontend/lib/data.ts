import { Calendar, Clipboard, Home, Mail, Table } from "lucide-react";
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
      icon: Home,
    },
    {
      title: "Student's Records",
      url: "/students",
      icon: Table,
    },
    {
      title: "Emails",
      url: "/emails",
      icon: Mail,
    },
    // {
    //   title: "Documentation",
    //   url: "/docs",
    //   icon: Clipboard,
    // },
    {
      title: "Calendar View",
      url: "/calendar",
      icon: Calendar,
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
