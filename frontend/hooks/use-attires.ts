"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Attire {
  id: string;
  name: string;
  gender: string;
  size: string;
  category: string;
  file_name: string;
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
        .select("id, name, gender, size, category, file_name");

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
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
        })
      )

      setAttires(withUrls);
      setLoading(false);
    }

    load();
  }, [supabase]);

  return { attires, loading, error };
}


/**
 * Interface for the relevant fields in the "attire_requests" table.
 */
export interface AttireRequestDate {
  id: string;
  student_id: string;
  attire_id: string;
  use_start_date: string;
  use_end_date: string;
  pickup_date: string;
  return_date: string;
  created_at: string;
  updated_at: string;
}

/**
 * A hook that fetches all rows from "attire_requests"
 * and returns the date fields (and related IDs).
 */
export function useAttireRequestDates() {
  const supabase = createClient();
  const [requests, setRequests] = useState<AttireRequestDate[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState<string | null>(null);

  useEffect(() => {
    async function loadDates() {
      setLoadingRequests(true);
      try {
        // Fetch the date‐related columns from "attire_requests"
        const { data, error: dbError } = await supabase
          .from<"attire_requests", AttireRequestDate>("attire_requests")
          .select(
            `
            id,
            student_id,
            attire_id,
            use_start_date,
            use_end_date,
            pickup_date,
            return_date,
            created_at,
            updated_at
          `
          );

        if (dbError) {
          setErrorRequests(dbError.message);
          setLoadingRequests(false);
          return;
        }

        setRequests(data ?? []);
      } catch (err) {
        setErrorRequests(
          err instanceof Error ? err.message : "Unknown error while loading"
        );
      } finally {
        setLoadingRequests(false);
      }
    }

    loadDates();
  }, [supabase]);

  return { requests, loadingRequests, errorRequests };
}