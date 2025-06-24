import { Calendar, Clipboard, Edit, Home, Plus, Table, View } from "lucide-react"

export const LOGO = "/logos/wino.png"

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Add Attires",
      url: "/add",
      icon: Plus,
    },
    {
      title: "View Attires",
      url: "/view",
      icon: View,
    },
    {
      title: "Student's Records",
      url: "/students",
      icon: Table,
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: Clipboard,
    },
    {
      title: "Calendar View",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Edit",
      url: "/edit",
      icon: Edit,
    },
  ],
}

export const shoppingCategories = [
  // "All",
  // "Lighting",
  // "Kitchenware",
  // "Home Decor",
  // "Plants",
  // "Office",
  // "Textiles",
]

// Gender options
export const genderOptions = [
  { value: "Men", label: "Men" },
  { value: "Female", label: "Female" },
  { value: "Unisex", label: "Unisex" },
] as const

// Size options
export const sizeOptions = [
  { value: "XS", label: "Extra Small (XS)" },
  { value: "S", label: "Small (S)" },
  { value: "M", label: "Medium (M)" },
  { value: "L", label: "Large (L)" },
  { value: "XL", label: "Extra Large (XL)" },
  { value: "No Size", label: "No Size" },
] as const

// Category options by gender
export const menCategories = ["Dress Pants", "Dress Shirts", "Suit Jackets", "Suits", "Shoes", "Ties"] as const

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
] as const

export const unisexCategories = ["Bags"] as const

// Combined categories for filtering (when no gender is selected)
export const allCategories = [...new Set([...menCategories, ...womenCategories, ...unisexCategories])].sort()

// Type definitions
export type Gender = (typeof genderOptions)[number]["value"]
export type Size = (typeof sizeOptions)[number]["value"]
export type Category = string // Use string instead of literal union since allCategories is dynamic
