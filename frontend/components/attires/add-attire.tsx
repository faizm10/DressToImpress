"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Upload, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { v4 as uuidv4 } from "uuid"
import { menCategories, womenCategories } from "@/lib/data"

export default function AttireUploadForm() {
  const supabase = createClient()

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    size: "",
    gender: "",
    category: "",
  })

  // File upload state
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [resetUpload, setResetUpload] = useState(false)
  const [dropzoneKey, setDropzoneKey] = useState(0)

  // Form submission state
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  // Initialize the Supabase upload hook
  const dropzoneProps = useSupabaseUpload({
    bucketName: "attires",
    maxFiles: 1,
    maxFileSize: Number.MAX_SAFE_INTEGER,
    allowedMimeTypes: ["image/*"],
    upsert: true,
    path: uploadedFileName || "",
  })

  const { files, isSuccess } = dropzoneProps

  // Available categories based on selected gender
  const categoryOptions = useMemo(() => {
    if (formState.gender === "Men") return menCategories
    if (formState.gender === "Female") return womenCategories
    return []
  }, [formState.gender])

  // Reset the form completely
  const resetForm = useCallback(() => {
    setFormState({
      name: "",
      size: "",
      gender: "",
      category: "",
    })
    setFile(null)
    setFileName("")
    setUploadedFileName(null)
    setDropzoneKey((prev) => prev + 1) // Force dropzone to remount
    setResetUpload(true)

    // Clear the success message after a short delay
    setTimeout(() => {
      setMsg("")
      setStatus("idle")
    }, 2000)

    // Reset the resetUpload flag after a short delay
    setTimeout(() => setResetUpload(false), 100)
  }, [])

  // Handle form field changes
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormState((prev) => {
      // If changing gender, reset category
      if (field === "gender") {
        return { ...prev, [field]: value, category: "" }
      }
      return { ...prev, [field]: value }
    })
  }, [])

  // Generate a unique filename when a file is selected
  useEffect(() => {
    if (files.length > 0 && !uploadedFileName) {
      const file = files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`

      // Set the filename
      setUploadedFileName(fileName)
      setFileName(fileName)
      setFile(file)
    } else if (files.length === 0 && !resetUpload) {
      // Reset when no files are selected (but not during form reset)
      setFileName("")
      setFile(null)
      setUploadedFileName(null)
    }
  }, [files, uploadedFileName, resetUpload])

  // When upload is successful, ensure we have the file info
  useEffect(() => {
    if (isSuccess && files.length > 0 && uploadedFileName) {
      setFileName(uploadedFileName)
      setFile(files[0])
    }
  }, [isSuccess, files, uploadedFileName])

  // Reset the dropzone when resetUpload changes
  useEffect(() => {
    if (resetUpload) {
      setUploadedFileName(null)
      setFileName("")
      setFile(null)
    }
  }, [resetUpload])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { name, size, gender, category } = formState

    if (!name || !size || !fileName || !file || !gender || !category) {
      setMsg("Please fill all fields and upload an image.")
      setStatus("error")
      return
    }

    setUploading(true)
    setMsg("")
    setStatus("idle")

    // Insert metadata - the file is already being uploaded by the Dropzone component
    const { error: insertError } = await supabase.from("attires").insert({
      name,
      size,
      file_name: fileName,
      gender,
      category,
    })

    if (insertError) {
      console.error(insertError.message)
      setMsg("Database insert failed")
      setStatus("error")
      setUploading(false)
      return
    }

    // Success!
    setMsg("Upload successful!")
    setStatus("success")
    setUploading(false)

    // Reset the entire form including the upload component
    resetForm()
  }

  return (
    <Card className="max-w-2xl w-full mx-auto">
      <CardHeader>
        <CardTitle>Upload Attire</CardTitle>
        <CardDescription>Add a new attire item with image to your collection</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formState.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="size">Size</Label>
                <Select value={formState.size} onValueChange={(value) => handleInputChange("size", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">Small (S)</SelectItem>
                    <SelectItem value="M">Medium (M)</SelectItem>
                    <SelectItem value="L">Large (L)</SelectItem>
                    <SelectItem value="XL">Extra Large (XL)</SelectItem>
                    <SelectItem value="No Size">No Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formState.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Men">Men</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  required
                  disabled={!formState.gender}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formState.gender ? "Select Category" : "Pick gender first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <Dropzone {...dropzoneProps} className="min-h-[150px]" key={`dropzone-${dropzoneKey}`}>
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
            {fileName && <p className="text-xs text-muted-foreground mt-1">Selected file: {fileName}</p>}
          </div>

          {status !== "idle" && (
            <Alert variant={status === "success" ? "default" : "destructive"}>
              {status === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{msg}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Attire"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
