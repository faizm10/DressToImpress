import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AttireUpload } from "@/components/attire-upload";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddAttire from "@/components/add-attire";
import AttireUploadForm from "@/components/add-attire";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <Card>
                <CardTitle>Upload Clothing</CardTitle>
                <CardContent>
                  <Label>Name of the Item</Label>
                  <Input className="w-[180px]" />
                  <Label>Select Gender</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Gender</SelectLabel>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Label>Size of the Item</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select the size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Sizes</SelectLabel>
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Label>Category</Label>
                  <Input className="w-[180px]" />
                </CardContent>
              </Card> */}
              {/* <AddAttire/>
              <AttireUpload /> */}
              <AttireUploadForm/>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
