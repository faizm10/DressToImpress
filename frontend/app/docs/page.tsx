import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shirt, Calendar, Users, Mail, Settings, AlertCircle, CheckCircle, Clock, Edit, Trash2, Plus, Eye } from 'lucide-react'

export default async function Docs() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
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
          <div className="@container/main flex flex-1 flex-col gap-8 p-6">
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shirt className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight">Clothing Management System</h1>
                <Badge variant="secondary">User Guide</Badge>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Complete guide for managing the University of Guelph's clothing rental system. 
                Everything you need to handle clothing inventory, student requests, and daily operations.
              </p>
            </div>

            {/* Admin Dashboard Usage Guide */}
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  How to Use the Admin Dashboard
                </CardTitle>
                <CardDescription>
                  The dashboard is your central hub for managing all aspects of the clothing rental system. Here's how to use its key features:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-semibold">1. Student Records:</span>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground">
                    <li>Navigate to the <span className="font-medium">Students</span> section from the sidebar.</li>
                    <li>View a list of all registered students, their contact info, and rental history.</li>
                    <li>Edit student details or add new students using the provided buttons.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">2. Calendar View:</span>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground">
                    <li>Access the <span className="font-medium">Calendar</span> from the sidebar to see all upcoming and current rentals.</li>
                    <li>Click on a date to view which items are checked out or due for return.</li>
                    <li>Use the calendar to plan availability and avoid double-booking.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">3. Editing Items:</span>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground">
                    <li>Go to the <span className="font-medium">Browse</span> or <span className="font-medium">Edit</span> section to see all clothing items.</li>
                    <li>Edit item details, upload new images, or remove items as needed.</li>
                    <li>Use the <span className="font-medium">Add New Item</span> button for new inventory.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">4. Dashboard Overview:</span>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground">
                    <li>The <span className="font-medium">Dashboard</span> provides a summary of recent activity, pending requests, and system status.</li>
                    <li>Quickly access common actions like approving requests or viewing inventory stats.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This guide is designed for staff members who manage the clothing system. No technical knowledge required!
              </AlertDescription>
            </Alert>

            <Separator />

           
            {/* Contact Support */}
            {/* <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Need Help?
                </CardTitle>
                <CardDescription>
                  If you encounter any issues or need assistance with the system, don't hesitate to reach out.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button variant="outline">
                  Contact Developer
                </Button>
                <Button>
                  Report Issue
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
