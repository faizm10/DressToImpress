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
                <h1 className="text-4xl font-bold tracking-tight">Attire Management System</h1>
                <Badge variant="secondary">User Guide</Badge>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Complete guide for managing the University of Guelph's attire rental system. 
                Everything you need to handle clothing inventory, student requests, and daily operations.
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This guide is designed for staff members who manage the attire system. No technical knowledge required!
              </AlertDescription>
            </Alert>

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">Add New Item</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Add new clothing items to the inventory</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Student Requests</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Review and respond to rental requests</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-lg">View Calendar</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">See what's rented out and when</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-lg">Edit Homepage</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Update contact info and about content</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Daily Tasks */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">Daily Tasks</h2>
              
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Morning Checklist
                    </CardTitle>
                    <CardDescription>Start your day with these essential tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">Check new student requests</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">Review today's returns</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">Check inventory levels</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      End of Day Tasks
                    </CardTitle>
                    <CardDescription>Wrap up your day with these tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm">Process returned items</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm">Send pickup notifications</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm">Update calendar for tomorrow</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Common Tasks */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">Common Tasks</h2>
              
              <div className="space-y-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        <CardTitle>Managing Clothing Items</CardTitle>
                      </div>
                      <Badge variant="outline">Essential</Badge>
                    </div>
                    <CardDescription>
                      How to add, edit, and remove clothing items from the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="flex items-center gap-2 p-2 rounded bg-green-50 text-green-700">
                        <Plus className="h-4 w-4" />
                        <span className="text-sm font-medium">Add Items</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-700">
                        <Edit className="h-4 w-4" />
                        <span className="text-sm font-medium">Edit Details</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded bg-red-50 text-red-700">
                        <Trash2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Remove Items</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <CardTitle>Handling Student Requests</CardTitle>
                      </div>
                      <Badge variant="outline">Daily</Badge>
                    </div>
                    <CardDescription>
                      Process rental requests, send emails, and manage pickups
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span>Review new requests in dashboard</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>Approve or deny based on availability</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Send automatic email notifications</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <CardTitle>Managing Rental Dates</CardTitle>
                      </div>
                      <Badge variant="outline">Important</Badge>
                    </div>
                    <CardDescription>
                      Track when items are rented out and ensure availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Each item has its own rental calendar. Dates that are booked will appear greyed out to students.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">System Status</h2>
              
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      Completed Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">✅ Homepage with contact info</div>
                    <div className="text-sm text-muted-foreground">✅ View clothing inventory</div>
                    <div className="text-sm text-muted-foreground">✅ Add new items</div>
                    <div className="text-sm text-muted-foreground">✅ Student request forms</div>
                    <div className="text-sm text-muted-foreground">✅ Individual item calendars</div>
                    <div className="text-sm text-muted-foreground">✅ Student records tracking</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">🔄 Edit clothing function</div>
                    <div className="text-sm text-muted-foreground">🔄 Delete function</div>
                    <div className="text-sm text-muted-foreground">🔄 Email templates</div>
                    <div className="text-sm text-muted-foreground">🔄 Multi-image upload</div>
                    <div className="text-sm text-muted-foreground">🔄 Calendar list view</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      Planned Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">📋 Editable homepage content</div>
                    <div className="text-sm text-muted-foreground">📋 Improved image browsing</div>
                    <div className="text-sm text-muted-foreground">📋 Enhanced checkout logic</div>
                    <div className="text-sm text-muted-foreground">📋 GraphQL migration</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Support */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
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
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
