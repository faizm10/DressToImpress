"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Upload, Check, AlertCircle, Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { v4 as uuidv4 } from "uuid"
import { menCategories, womenCategories,unisexCategories } from "@/lib/data"

export default function AttireUploadForm() {
  const supabase = createClient()

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    size: "",
    gender: "",
    category: "",
    color: "",
  })

  // Category management state
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [customCategories, setCustomCategories] = useState({
    Men: [...menCategories],
    Female: [...womenCategories],
    Unisex: [...unisexCategories]
  })

  // Color management state
  const [showColorManager, setShowColorManager] = useState(false)
  const [editingColor, setEditingColor] = useState<string | null>(null)
  const [newColorName, setNewColorName] = useState("")
  const [customColors, setCustomColors] = useState<string[]>([
    "Black", "White", "Gray", "Navy", "Brown", "Beige", "Tan", "Burgundy", 
    "Maroon", "Blue", "Light Blue", "Red", "Pink", "Purple", "Green", 
    "Olive", "Yellow", "Orange", "Teal", "Cream", "Ivory", "Charcoal", "Other"
  ])

  // File upload state
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [resetUpload, setResetUpload] = useState(false)
  const [dropzoneKey, setDropzoneKey] = useState(0)

  // Form submission state
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState("")

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
    if (formState.gender === "Men") return customCategories.Men
    if (formState.gender === "Female") return customCategories.Female
    if (formState.gender === "Unisex") return customCategories.Unisex
    return []
  }, [formState.gender, customCategories])

  // Reset the form completely
  const resetForm = useCallback(() => {
    setFormState({
      name: "",
      size: "",
      gender: "",
      category: "",
      color: "",
    })
    setFile(null)
    setFileName("")
    setUploadedFileName(null)
    setDropzoneKey((prev) => prev + 1) // Force dropzone to remount
    setResetUpload(true)

    // Clear the success message after a short delay
    setTimeout(() => {
      setMsg("")
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

  // Category management functions
  const handleAddCategory = useCallback(() => {
    if (!newCategoryName.trim() || !formState.gender) return
    
    setCustomCategories(prev => ({
      ...prev,
      [formState.gender]: [...prev[formState.gender as keyof typeof prev], newCategoryName.trim()]
    }))
    setNewCategoryName("")
  }, [newCategoryName, formState.gender])

  const handleEditCategory = useCallback((oldName: string, newName: string) => {
    if (!newName.trim() || !formState.gender) return
    
    setCustomCategories(prev => ({
      ...prev,
      [formState.gender]: prev[formState.gender as keyof typeof prev].map(cat => 
        cat === oldName ? newName.trim() : cat
      )
    }))
    setEditingCategory(null)
    
    // Update form state if the edited category was selected
    if (formState.category === oldName) {
      setFormState(prev => ({ ...prev, category: newName.trim() }))
    }
  }, [formState.gender, formState.category])

  const handleDeleteCategory = useCallback((categoryName: string) => {
    if (!formState.gender) return
    
    setCustomCategories(prev => ({
      ...prev,
      [formState.gender]: prev[formState.gender as keyof typeof prev].filter(cat => cat !== categoryName)
    }))
    
    // Clear form category if the deleted category was selected
    if (formState.category === categoryName) {
      setFormState(prev => ({ ...prev, category: "" }))
    }
  }, [formState.gender, formState.category])

  // Color management functions
  const handleAddColor = useCallback(() => {
    if (!newColorName.trim()) return
    
    setCustomColors(prev => {
      if (prev.includes(newColorName.trim())) return prev
      return [...prev, newColorName.trim()]
    })
    setNewColorName("")
  }, [newColorName])

  const handleEditColor = useCallback((oldName: string, newName: string) => {
    if (!newName.trim()) return
    
    setCustomColors(prev => 
      prev.map(color => color === oldName ? newName.trim() : color)
    )
    setEditingColor(null)
    
    // Update form state if the edited color was selected
    if (formState.color === oldName) {
      setFormState(prev => ({ ...prev, color: newName.trim() }))
    }
  }, [formState.color])

  const handleDeleteColor = useCallback((colorName: string) => {
    setCustomColors(prev => prev.filter(color => color !== colorName))
    
    // Clear form color if the deleted color was selected
    if (formState.color === colorName) {
      setFormState(prev => ({ ...prev, color: "" }))
    }
  }, [formState.color])

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

    const { name, size, gender, category, color } = formState

    if (!name || !size || !fileName || !file || !gender || !category || !color) {
      setMsg("Please fill all fields and upload an image.")
      return
    }

    setUploading(true)
    setMsg("")

    // Insert metadata - the file is already being uploaded by the Dropzone component
    const { error: insertError } = await supabase.from("attires").insert({
      name,
      size,
      file_name: fileName,
      gender,
      category,
      color,
    })

    if (insertError) {
      console.error(insertError.message)
      setMsg("Database insert failed")
      setUploading(false)
      return
    }

    // Success!
    setMsg("Upload successful!")
    setUploading(false)

    // Reset the entire form including the upload component
    resetForm()
  }

  return (
    <Card className="max-w-2xl w-full mx-auto">
      <CardHeader>
        <CardTitle>Upload Clothing</CardTitle>
        <CardDescription>Add a new clothing item with image to your collection</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Basic Information</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Black Formal Suit, White Dress Shirt"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formState.gender} 
                    onValueChange={(value) => handleInputChange("gender", value)} 
                    required
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Choose gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Men" className="cursor-pointer hover:bg-blue-50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Men
                        </div>
                      </SelectItem>
                      <SelectItem value="Female" className="cursor-pointer hover:bg-pink-50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          Women
                        </div>
                      </SelectItem>
                      <SelectItem value="Unisex" className="cursor-pointer hover:bg-purple-50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Unisex
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size" className="text-sm font-medium">
                    Size <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formState.size} 
                    onValueChange={(value) => handleInputChange("size", value)} 
                    required
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XS" className="cursor-pointer">Extra Small (XS)</SelectItem>
                      <SelectItem value="S" className="cursor-pointer">Small (S)</SelectItem>
                      <SelectItem value="M" className="cursor-pointer">Medium (M)</SelectItem>
                      <SelectItem value="L" className="cursor-pointer">Large (L)</SelectItem>
                      <SelectItem value="XL" className="cursor-pointer">Extra Large (XL)</SelectItem>
                      <SelectItem value="XXL" className="cursor-pointer">Extra Extra Large (XXL)</SelectItem>
                      <SelectItem value="No Size" className="cursor-pointer">No Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm font-medium">
                  Color <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formState.color}
                  onValueChange={(value) => handleInputChange("color", value)}
                  required
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {customColors.length > 0 ? (
                      customColors.map((color) => (
                        <SelectItem key={color} value={color} className="cursor-pointer hover:bg-blue-50">
                          {color}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No colors available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                
                {/* Color Manager Button */}
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowColorManager(!showColorManager)}
                    className="text-xs"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Manage Colors
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Category Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                formState.gender 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                2
              </div>
              <h3 className={`font-medium transition-all duration-200 ${
                formState.gender 
                  ? 'text-gray-900 dark:text-gray-100' 
                  : 'text-gray-400'
              }`}>
                Category Selection
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  required
                  disabled={!formState.gender}
                >
                  <SelectTrigger className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                    !formState.gender ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    <SelectValue 
                      placeholder={
                        !formState.gender 
                          ? "Please select gender first" 
                          : `Choose ${formState.gender.toLowerCase()} category`
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.length > 0 ? (
                      categoryOptions.map((opt) => (
                        <SelectItem key={opt} value={opt} className="cursor-pointer hover:bg-blue-50">
                          {opt}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No categories available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                                 {!formState.gender && (
                   <p className="text-xs text-amber-600 dark:text-amber-400">
                     Please select a gender first to see available categories
                   </p>
                 )}
                 
                 {/* Category Manager Button */}
                 {formState.gender && (
                   <div className="pt-2">
                     <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={() => setShowCategoryManager(!showCategoryManager)}
                       className="text-xs"
                     >
                       <Edit2 className="h-3 w-3 mr-1" />
                       Manage Categories
                     </Button>
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* Category Manager */}
           {showCategoryManager && formState.gender && (
             <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
               <div className="flex items-center justify-between">
                 <h4 className="font-medium text-sm">Manage {formState.gender} Categories</h4>
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   onClick={() => setShowCategoryManager(false)}
                 >
                   <X className="h-4 w-4" />
                 </Button>
               </div>
               
               {/* Add New Category */}
               <div className="flex gap-2">
                 <Input
                   placeholder="New category name"
                   value={newCategoryName}
                   onChange={(e) => setNewCategoryName(e.target.value)}
                   className="flex-1"
                   onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                 />
                 <Button
                   type="button"
                   size="sm"
                   onClick={handleAddCategory}
                   disabled={!newCategoryName.trim()}
                 >
                   <Plus className="h-4 w-4" />
                 </Button>
               </div>

               {/* Category List */}
               <div className="space-y-2">
                 {categoryOptions.map((category) => (
                   <div key={category} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                     {editingCategory === category ? (
                       <div className="flex gap-2 flex-1">
                         <Input
                           value={newCategoryName}
                           onChange={(e) => setNewCategoryName(e.target.value)}
                           className="flex-1"
                           onKeyPress={(e) => e.key === 'Enter' && handleEditCategory(category, newCategoryName)}
                         />
                         <Button
                           type="button"
                           size="sm"
                           variant="outline"
                           onClick={() => handleEditCategory(category, newCategoryName)}
                           disabled={!newCategoryName.trim()}
                         >
                           <Save className="h-4 w-4" />
                         </Button>
                         <Button
                           type="button"
                           size="sm"
                           variant="outline"
                           onClick={() => {
                             setEditingCategory(null)
                             setNewCategoryName("")
                           }}
                         >
                           <X className="h-4 w-4" />
                         </Button>
                       </div>
                     ) : (
                       <>
                         <span className="text-sm">{category}</span>
                         <div className="flex gap-1">
                           <Button
                             type="button"
                             size="sm"
                             variant="ghost"
                             onClick={() => {
                               setEditingCategory(category)
                               setNewCategoryName(category)
                             }}
                           >
                             <Edit2 className="h-3 w-3" />
                           </Button>
                           <Button
                             type="button"
                             size="sm"
                             variant="ghost"
                             onClick={() => handleDeleteCategory(category)}
                             className="text-red-600 hover:text-red-700"
                           >
                             <Trash2 className="h-3 w-3" />
                           </Button>
                         </div>
                       </>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           )}

          {/* Color Manager */}
          {showColorManager && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Manage Colors</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColorManager(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Add New Color */}
              <div className="flex gap-2">
                <Input
                  placeholder="New color name"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddColor()}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddColor}
                  disabled={!newColorName.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Color List */}
              <div className="space-y-2">
                {customColors.map((color) => (
                  <div key={color} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                    {editingColor === color ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && handleEditColor(color, newColorName)}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditColor(color, newColorName)}
                          disabled={!newColorName.trim()}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingColor(null)
                            setNewColorName("")
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm">{color}</span>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingColor(color)
                              setNewColorName(color)
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteColor(color)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Image</Label>
            <Dropzone {...dropzoneProps} className="min-h-[150px]" key={`dropzone-${dropzoneKey}`}>
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
            {fileName && <p className="text-xs text-muted-foreground mt-1">Selected file: {fileName}</p>}
          </div>

          {msg && (
            <Alert variant="default">
              <Check className="h-4 w-4" />
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
              "Upload Clothing"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
