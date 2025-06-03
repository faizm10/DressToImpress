//view the table of items from the supabase as well as options of what to do with it (delete, edit)
"use client"
import { Loader2, Edit2, Trash2 } from "lucide-react"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AttireWithUrl } from "@/hooks/use-attires"
import { menCategories, womenCategories } from "@/lib/data"
import { AttireUpload } from "./attire-upload1"
import { toast } from "sonner"

const sizes = ["S", "M", "L", "XL", "No Size"] as const
const genders = ["Men", "Female"] as const

export default function ViewTable() {
  const [supabase] = useState(() => createClient())
  const [attires, setAttires] = useState<AttireWithUrl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<AttireWithUrl | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    gender: "",
    size: "",
    category: "",
    fileName: "",
    file: null as File | null,
    imageUrl: "",
  })
  const [editResetUpload, setEditResetUpload] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadAttires = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 1) fetch rows from your DB
      const { data, error: dbError } = await supabase
        .from("attires")
        .select("id, name, gender, size, category, file_name")

      if (dbError) {
        throw new Error(dbError.message)
      }

      // 2) for each row, build a public URL directly from the file name
      const withUrls = await Promise.all(
        (data || []).map(async (item) => {
          try {
            if (!item.file_name) {
              return {
                ...item,
                imageUrl: null,
              }
            }

            // build a public URL directly using the file name
            const { data: urlData } = supabase.storage.from("attires").getPublicUrl(item.file_name)

            return {
              ...item,
              imageUrl: urlData.publicUrl,
            }
          } catch (err) {
            console.error(`Error loading image for ${item.name}:`, err)
            return {
              ...item,
              imageUrl: null,
            }
          }
        }),
      )

      setAttires(withUrls as AttireWithUrl[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attires")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadAttires()
  }, [loadAttires])

  const handleEditOpen = useCallback((item: AttireWithUrl) => {
    setEditItem(item)
    setEditForm({
      name: item.name,
      gender: item.gender,
      size: item.size,
      category: item.category,
      fileName: item.file_name,
      file: null,
      imageUrl: item.imageUrl || "",
    })
    setEditResetUpload(false)
  }, [])

  const handleEditChange = useCallback((field: string, value: string | File | null) => {
    setEditForm((prev) => {
      if (field === "file") {
        return { ...prev, file: value as File | null }
      }
      if (field === "gender") {
        return { ...prev, gender: typeof value === "string" ? value : "", category: "" }
      }
      return { ...prev, [field]: typeof value === "string" ? value : "" }
    })
  }, [])

  const handleEditFileUpload = useCallback((fileName: string, file: File | null) => {
    setEditForm((prev) => ({ ...prev, fileName, file }))
  }, [])

  const handleEditSave = useCallback(async () => {
    if (!editItem) return

    try {
      setSaving(true)
      setError(null)

      let finalFileName = editItem.file_name // Keep original file name by default

      // If a new file is uploaded, upload it and update the file name
      if (editForm.file && editForm.fileName) {
        const { error: uploadError } = await supabase.storage
          .from("attires")
          .upload(editForm.fileName, editForm.file, { upsert: true })

        if (uploadError) {
          throw new Error(uploadError.message)
        }
        finalFileName = editForm.fileName // Only update if new file was uploaded
      }

      // Update the DB row
      const { error: updateError } = await supabase
        .from("attires")
        .update({
          name: editForm.name,
          gender: editForm.gender,
          size: editForm.size,
          category: editForm.category,
          file_name: finalFileName, // Use the final file name (original or new)
        })
        .eq("id", editItem.id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      toast.success("Item updated successfully")
      setEditItem(null)
      setEditResetUpload(true)
      await loadAttires() // Reload data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update item"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setSaving(false)
      // Reset the upload component after a short delay to ensure the form is closed
      setTimeout(() => setEditResetUpload(false), 100)
    }
  }, [editItem, editForm, supabase, loadAttires])

  const handleDelete = useCallback(
    async (item: AttireWithUrl) => {
      try {
        setDeleting(true)
        setError(null)

        // Delete from database
        const { error: deleteError } = await supabase.from("attires").delete().eq("id", item.id)

        if (deleteError) {
          throw new Error(deleteError.message)
        }

        // Optionally delete from storage
        if (item.file_name) {
          await supabase.storage.from("attires").remove([item.file_name])
        }

        toast.success("Item deleted successfully")
        await loadAttires() // Reload data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete item"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setDeleting(false)
      }
    },
    [supabase, loadAttires],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
        <span>Loading attires...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadAttires} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableCaption>Attire Inventory Management</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attires.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No attires found.
                </TableCell>
              </TableRow>
            ) : (
              attires.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                      {item.size}
                    </span>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-50 h-50 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Edit Dialog */}
                      <Dialog
                        open={editItem?.id === item.id}
                        onOpenChange={(open) => {
                          if (!open) setEditItem(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEditOpen(item)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Item Details</DialogTitle>
                            <DialogDescription>Update the information for this attire item.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Name</Label>
                              <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => handleEditChange("name", e.target.value)}
                                placeholder="Enter item name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-gender">Gender</Label>
                              <Select
                                value={editForm.gender}
                                onValueChange={(value) => handleEditChange("gender", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  {genders.map((gender) => (
                                    <SelectItem key={gender} value={gender}>
                                      {gender}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-size">Size</Label>
                              <Select value={editForm.size} onValueChange={(value) => handleEditChange("size", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sizes.map((size) => (
                                    <SelectItem key={size} value={size}>
                                      {size}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-category">Category</Label>
                              <Select
                                value={editForm.category}
                                onValueChange={(value) => handleEditChange("category", value)}
                                disabled={!editForm.gender}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(editForm.gender === "Men"
                                    ? menCategories
                                    : editForm.gender === "Female"
                                      ? womenCategories
                                      : []
                                  ).map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Image</Label>
                              {editForm.imageUrl && (
                                <img
                                  src={editForm.imageUrl || "/placeholder.svg"}
                                  alt="Current"
                                  className="w-24 h-24 object-cover rounded-md border mb-2"
                                />
                              )}
                              <AttireUpload onFileUpload={handleEditFileUpload} reset={editResetUpload} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditItem(null)} disabled={saving}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditSave} disabled={saving}>
                              {saving ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={deleting}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete "{item.name}" and remove it
                              from the inventory.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deleting}
                            >
                              {deleting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
