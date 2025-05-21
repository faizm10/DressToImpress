//view the table of items from the supabase as well as options of what to do with it (delete, edit)
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import type { Attire, AttireWithUrl } from "@/hooks/use-attires";
import { Edit2, Trash2 } from "lucide-react";

export default function ViewTable() {
  const supabase = createClient();
  const [attires, setAttires] = useState<AttireWithUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // 1) fetch rows from your DB
      const { data, error: dbError } = await supabase
        .from<"attires", Attire>("attires")
        .select("id, name, gender, size, category, file_name, status");

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      // 2) for each row, list the storage folder and build a public URL
      const withUrls = await Promise.all(
        (data || []).map(async (item) => {
          // list files in the folder named item.file_name
          const { data: files, error: listError } = await supabase.storage
            .from("attires")
            .list(item.file_name);

          if (listError || !files || files.length === 0) {
            // Make sure to include the status property
            return {
              ...item,
              imageUrl: null,
              // If status is undefined, provide a default value
              status: item.status || "Available",
            };
          }

          // pick the first file in that folder
          const fileInFolder = files[0].name;

          // build a public URL
          const { data: urlData } = supabase.storage
            .from("attires")
            .getPublicUrl(`${item.file_name}/${fileInFolder}`);

          return {
            ...item,
            imageUrl: urlData.publicUrl,
            // If status is undefined, provide a default value
            status: item.status || "Available",
          };
        })
      );

      setAttires(withUrls as AttireWithUrl[]);
      setLoading(false);
    }

    load();
  }, [supabase]);

  if (loading) return <p className="text-center py-4">Loading…</p>;
  if (error) return <p className="text-center py-4 text-red-600">{error}</p>;

  return (
    <Table className="max-w-8xl w-full mx-auto">
      <TableCaption>Attire Table</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attires.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.name}</TableCell>
            <TableCell>{a.gender}</TableCell>
            <TableCell>{a.size}</TableCell>
            <TableCell>{a.category}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  a.status === "Available"
                    ? "bg-green-100 text-green-800"
                    : a.status === "Reserved"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {a.status}
              </span>
            </TableCell>
            <TableCell>
              {a.imageUrl ? (
                <img
                  src={a.imageUrl || "/placeholder.svg"}
                  alt={a.name}
                  className="w-45 h-45 object-cover rounded"
                />
              ) : (
                "No image"
              )}
            </TableCell>
            <TableCell className="space-x-2 w-[50]">
              <Button className="bg-yellow-300 text-black">
                {" "}
                <Edit2 /> Edit
              </Button>
              <Button variant={"destructive"}>
                {" "}
                <Trash2 /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
