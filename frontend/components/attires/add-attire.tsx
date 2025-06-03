"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Check, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AttireUpload } from "./attire-upload1";
import { menCategories, womenCategories } from "@/lib/data";
export default function AttireUploadForm() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const categoryOptions = useMemo(() => {
    if (gender === "Men") return menCategories;
    if (gender === "Female") return womenCategories;
    return [];
  }, [gender]);
  const handleFileUpload = (
    uploadedFileName: string,
    uploadedFile: File | null
  ) => {
    setFileName(uploadedFileName);
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !size || !fileName || !file || !gender || !category) {
      setMsg("Please fill all fields and upload an image.");
      setStatus("error");
      return;
    }

    setUploading(true);
    setMsg("");
    setStatus("idle");

    // Insert metadata - the file is already being uploaded by the Dropzone component
    const { error: insertError } = await supabase.from("attires").insert({
      name,
      size,
      file_name: fileName,
      gender,
      category,
    });

    if (insertError) {
      console.error(insertError.message);
      setMsg("Database insert failed");
      setStatus("error");
      setUploading(false);
      return;
    }

    // Success!
    setMsg("Upload successful!");
    setStatus("success");
    setName("");
    setSize("");
    setCategory("");
    setGender("");
    setFile(null);
    setFileName("");
    setUploading(false);
  };

  return (
    <Card className="max-w-2xl w-full mx-auto">
      <CardHeader>
        <CardTitle>Upload Attire</CardTitle>
        <CardDescription>
          Add a new attire item with image to your collection
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex space-x-2">
              <Label htmlFor="size">Size</Label>
              <Select value={size} onValueChange={setSize} required>
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
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={gender}
                onValueChange={(val) => {
                  setGender(val);
                  setCategory(""); // reset category whenever gender changes
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="category">Category</Label>
              <Select
                // id="category"
                value={category}
                onValueChange={setCategory}
                required
                disabled={!gender} // optional: disable until gender is picked
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      gender ? "Select Category" : "Pick gender first"
                    }
                  />
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

          <div className="space-y-2">
            <Label>Image</Label>
            <AttireUpload onFileUpload={handleFileUpload} />
            {fileName && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected file: {fileName}
              </p>
            )}
          </div>

          {status !== "idle" && (
            <Alert variant={status === "success" ? "default" : "destructive"}>
              {status === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
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
  );
}