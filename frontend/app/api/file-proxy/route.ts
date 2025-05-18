import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fileId = searchParams.get("file")

  if (!fileId) {
    return new NextResponse("File ID is required", { status: 400 })
  }

  try {
    const supabase = await createClient()

    // Get the file from Supabase Storage
    const { data, error } = await supabase.storage.from("student-items").download(fileId)

    if (error) {
      throw error
    }

    // Return the file with appropriate headers
    return new NextResponse(data, {
      headers: {
        "Content-Type": "image/png", // Adjust based on your file types
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error: any) {
    console.error("Error fetching file:", error)
    return new NextResponse("Error fetching file", { status: 500 })
  }
}
