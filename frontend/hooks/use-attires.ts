import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Attire {
  id: string;
  name: string;
  gender: string;
  size: string;
  category: string;
  file_name: string;
  status: string;
}

export interface AttireWithUrl extends Attire {
  imageUrl: string | null;
}

export function useAttires() {
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

  useEffect(() => {
    async function fetchAttires() {
      const { data, error: dbError } = await supabase
        .from<"attires", Attire>("attires")
        .select("id, name, gender, size, category, file_name, status");

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      const attiresWithUrls = await Promise.all(
        (data || []).map(async (item) => {
          const { data: files } = await supabase.storage
            .from("attires")
            .list(item.file_name);

          const firstImage = files?.[0]?.name;
          const { data: urlData } = supabase.storage
            .from("attires")
            .getPublicUrl(`${item.file_name}/${firstImage}`);

          return {
            ...item,
            imageUrl: urlData?.publicUrl ?? null,
          };
        })
      );

      setAttires(attiresWithUrls);
      setLoading(false);
    }

    fetchAttires();
  }, [supabase]);

  return { attires, loading, error };
}
