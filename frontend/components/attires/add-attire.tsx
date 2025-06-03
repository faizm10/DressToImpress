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
import { AttireUpload } from "./attire-upload";
import { menCategories, womenCategories } from "@/lib/data";

const sizes = ["S", "M", "L", "XL", "No Size"] as const;
const genders = ["Men", "Female"] as const;

export default function AttireUploadForm() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [size, setSize] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [resetUpload, setResetUpload] = useState(false);

  const categoryOptions = useMemo(() => {
    if (gender === "Men") return menCategories;
    if (gender === "Female") return womenCategories;
    return [];
  }, [gender]);

  const handleFileUpload = (uploadedFileName: string, uploadedFile: File | null) => {
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

    try {
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("attires")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Insert metadata into database
      const { error: insertError } = await supabase.from("attires").insert({
        name,
        size,
        file_name: fileName,
        gender,
        category,
      });

      if (insertError) {
        throw insertError;
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
      setResetUpload(true);
      // Reset the reset flag after a short delay
      setTimeout(() => setResetUpload(false), 100);
    } catch (error) {
      console.error(error);
      setMsg("Upload failed. Please try again.");
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Attire</CardTitle>
        <CardDescription>Upload a new attire to the collection</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter attire name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Select value={size} onValueChange={setSize} required>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={!gender}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <AttireUpload onFileUpload={handleFileUpload} reset={resetUpload} />
          </div>

          {msg && (
            <Alert variant={status === "error" ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{msg}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Attire
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}