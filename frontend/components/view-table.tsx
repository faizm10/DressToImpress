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
import { Attire, AttireWithUrl } from "@/hooks/use-attires";

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
        .select("id, name, gender, size, category, file_name");

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
            return { ...item, imageUrl: null };
          }

          // pick the first file in that folder
          const fileInFolder = files[0].name;

          // build a public URL
          const { data: urlData } = supabase.storage
            .from("attires")
            .getPublicUrl(`${item.file_name}/${fileInFolder}`);

          return { ...item, imageUrl: urlData.publicUrl };
        })
      );

      setAttires(withUrls);
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
              {a.imageUrl ? (
                <img
                  src={a.imageUrl}
                  alt={a.name}
                  className="w-45 h-45 object-cover rounded"
                />
              ) : (
                "No image"
              )}
            </TableCell>
            <TableCell className="space-x-2 w-[50]">
              <Button>Edit</Button>
              <Button>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
