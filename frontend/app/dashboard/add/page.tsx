import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function AddPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  return <>LOL</>;
}
