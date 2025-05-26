import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { EmailActions } from "@/components/email-actions"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function EmailPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Example rental data - replace with actual data from your database
  const sampleRentalData = {
    firstName: "John",
    email: "john.doe@example.com",
    rentalStartDate: "2024-01-15",
    rentalEndDate: "2024-01-20",
    pickupDate: "2024-01-14",
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
        <div className="flex flex-1 flex-col p-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Email Management</h1>
            <EmailActions rentalData={sampleRentalData} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
