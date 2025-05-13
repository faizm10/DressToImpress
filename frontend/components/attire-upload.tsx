"use client"

import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AttireUpload() {
  const dropzoneProps = useSupabaseUpload({
    bucketName: "attires",
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    allowedMimeTypes: ["image/*"],
    upsert: true,
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Attires</CardTitle>
        <CardDescription>
          Upload images of your attires. You can upload up to 5 images at a time, with a maximum size of 10MB each.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dropzone {...dropzoneProps} className="min-h-[200px] flex flex-col justify-center">
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </CardContent>
    </Card>
  )
}
