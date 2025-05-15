"use client";

import type React from "react";

import { useState } from "react";
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

export default function AttireUploadForm() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFileUpload = (
    uploadedFileName: string,
    uploadedFile: File | null
  ) => {
    setFileName(uploadedFileName);
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !size || !fileName || !file) {
      setMsg("Please fill all fields and upload an image.");
      setStatus("error");
      return;
    }

    setUploading(true);
    setMsg("");
    setStatus("idle");

    // Get image dimensions
    let width = 0;
    let height = 0;
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (!ev.target?.result) return reject("No image data");
          img.src = ev.target.result as string;
        };
        img.onload = () => {
          width = img.width;
          height = img.height;
          resolve();
        };
        reader.onerror = reject;
        if (file) {
          reader.readAsDataURL(file);
        } else {
          reject("No file selected");
        }
      });
    } catch (err) {
      console.error(err);
      setMsg("Failed to read image dimensions");
      setStatus("error");
      setUploading(false);
      return;
    }

    // Insert metadata - the file is already being uploaded by the Dropzone component
    const { error: insertError } = await supabase.from("attires").insert({
      name,
      size,
      file_name: fileName,
      size_kb: file ? (file.size / 1024).toFixed(2) : "0",
      type: file ? file.type : "",
      width,
      height,
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
    setFile(null);
    setFileName("");
    setUploading(false);
  };

  return (
    <Card className="max-w-md w-full mx-auto">
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
