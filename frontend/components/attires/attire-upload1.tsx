"use client"

import { useState, useEffect, Fragment } from "react"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { v4 as uuidv4 } from "uuid"

interface AttireUploadProps {
  onFileUpload: (fileName: string, file: File | null) => void
  reset?: boolean
}

export function AttireUpload({ onFileUpload, reset }: AttireUploadProps) {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  // Reset when reset prop changes
  useEffect(() => {
    if (reset) {
      setUploadedFileName(null)
      onFileUpload("", null)
    }
  }, [reset, onFileUpload])

  // Initialize the hook with the proper configuration
  const dropzoneProps = useSupabaseUpload({
    bucketName: "attires",
    maxFiles: 1,
    maxFileSize: Number.MAX_SAFE_INTEGER,
    allowedMimeTypes: ["image/*"],
    upsert: true,
    path: uploadedFileName || "",
  })

  const { files, isSuccess, successes } = dropzoneProps

  // Generate a unique filename when a file is selected
  useEffect(() => {
    if (files.length > 0 && !uploadedFileName) {
      const file = files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`

      // Set the filename
      setUploadedFileName(fileName)

      // Pass the filename and file object back to the parent
      onFileUpload(fileName, file)
    } else if (files.length === 0) {
      // Reset when no files are selected
      onFileUpload("", null)
      setUploadedFileName(null)
    }
  }, [files, onFileUpload, uploadedFileName])

  // When upload is successful, ensure parent knows about it
  useEffect(() => {
    if (isSuccess && files.length > 0 && uploadedFileName) {
      // Confirm the upload was successful
      onFileUpload(uploadedFileName, files[0])
    }
  }, [isSuccess, files, uploadedFileName, onFileUpload])

  return (
    <Dropzone {...dropzoneProps} className="min-h-[150px]" key={reset ? "reset" : "normal"}>
      <Fragment key="dropzone-children">
        <DropzoneEmptyState />
        <DropzoneContent />
      </Fragment>
    </Dropzone>
  )
}
