import type { HomePageContent } from "@/types/content";
import { createClient } from "./supabase/client";

const DEFAULT_CONTENT: HomePageContent = {
  hero: {
    badge: "Exclusive for Lang Students",
    title: "Dress to",
    highlightWord: "Impress",
    description:
      "This sustainable program allows Lang students to borrow business casual attire for all of their academic and job search needs. This initiative helps B.Comm students put their best foot forward, thanks to generous clothing donations from the Lang community.",
    buttonText: "Browse Collection",
    buttonLink: "/browse",
  },
  howItWorks: {
    title: "How It Works",
    subtitle:
      "A simple three-step process to get you looking your best for any professional occasion",
    steps: [
      {
        id: "browse",
        icon: "Search",
        title: "Browse & Select",
        description:
          "Explore our curated collection of professional attire available for your selected dates",
      },
      {
        id: "pickup",
        icon: "Clock",
        title: "Pick Up",
        description:
          "Collect your items from the Business Career Development Centre (MACS 101)",
      },
      {
        id: "return",
        icon: "Package",
        title: "Return",
        description: "Simply return your items - we handle the dry cleaning!",
      },
    ],
  },
  rentalGuidelines: {
    title: "Rental Guidelines",
    subtitle:
      "Simple rules to ensure everyone has access to professional attire",
    rules: [
      {
        id: "period",
        icon: "Calendar",
        title: "Rental Period",
        items: [
          "Two-week rental period from pickup date",
          "Extensions available with BCDC approval",
        ],
      },
      {
        id: "hours",
        icon: "Clock4",
        title: "Operating Hours",
        items: [
          "Monday to Friday: 8:30 AM - 4:30 PM",
          "Closed on weekends and holidays",
        ],
      },
      {
        id: "location",
        icon: "MapPin",
        title: "Location",
        items: [
          "Business Career Development Centre (MACS 101)",
          "All pickups and returns must be done in person",
        ],
      },
      {
        id: "additional",
        icon: "Sparkles",
        title: "Additional Info",
        items: [
          "No cleaning required - we handle all dry cleaning",
          "Items must be returned in good condition",
        ],
      },
    ],
  },
  cta: {
    title: "Looking to Donate Clothes to the Program?",
    email: "langcareers@uoguelph.ca",
    emailLabel: "Email us at",
  },
};

export async function getHomePageContent(): Promise<HomePageContent> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("home_page_content")
      .select("content")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching content:", error);
      return DEFAULT_CONTENT;
    }

    return data.content as HomePageContent;
  } catch (error) {
    console.error("Error fetching content:", error);
    return DEFAULT_CONTENT;
  }
}

export async function saveHomePageContent(
  content: HomePageContent
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("home_page_content").insert({
      content: content,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving content:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving content:", error);
    return { success: false, error: "Failed to save content" };
  }
}

export async function resetHomePageContent(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("home_page_content").insert({
      content: DEFAULT_CONTENT,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error resetting content:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error resetting content:", error);
    return { success: false, error: "Failed to reset content" };
  }
}
