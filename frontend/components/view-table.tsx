"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

interface Attire {
  id: string;
  name: string;
  gender: string;
  size: string;
  category: string;
}

export default function ViewTable() {
  const supabase = createClient();
  const [attires, setAttires] = useState<Attire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // fetch everything from the 'attires' table
    supabase
      .from<"attires", Attire>("attires")
      .select("id, name, gender, size, category")
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setError(error.message);
        } else {
          setAttires(data || []);
        }
        setLoading(false);
      });
  }, [supabase]);

  if (loading) return <p className="text-center py-4">Loading…</p>;
  if (error) return <p className="text-center py-4 text-red-600">{error}</p>;
  return (
    <>
      <Table className="max-w-2xl w-full mx-auto">
        <TableCaption>Attire Tables</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>
        {attires.map((attire) => (
          <TableRow key={attire.id}>
            <TableCell>{attire.name}</TableCell>
            <TableCell>{attire.gender}</TableCell>
            <TableCell>{attire.size}</TableCell>
            <TableCell>{attire.category}</TableCell>
            <TableCell>Coming Soon</TableCell>
          </TableRow>
        ))}
      </Table>
    </>
  );
}
