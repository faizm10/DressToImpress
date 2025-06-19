import { type NextRequest, NextResponse } from "next/server"
import type { HomePageContent } from "@/types/content"
import { createClient } from "@/lib/supabase/client"

const supabase = await createClient();

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("home_page_content")
      .select("content")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching content:", error)
      return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
    }

    return NextResponse.json({ content: data.content })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const content: HomePageContent = body.content

    const { error } = await supabase.from("home_page_content").insert({
      content: content,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error saving content:", error)
      return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
