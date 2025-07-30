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
            {/* <Card className="bg-primary/5 border-primary/10">
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
            </Card> */}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This guide is designed for staff members who manage the clothing system. No technical knowledge required!
              </AlertDescription>
            </Alert>

            <Separator />

            {/* Status Management Guide */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Understanding Rental Statuses
                </CardTitle>
                <CardDescription>
                  A complete guide to the rental status workflow and how to manage each stage of the rental process.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Initial Request Stage */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Plus className="h-4 w-4 text-blue-600" />
                    1. Initial Request Stage
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Requested
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground space-y-1">
                      <li>When a student makes an attire request, the status starts as <span className="font-medium">"Requested"</span> (new/unseen)</li>
                      <li>Once you review the request, change the status to <span className="font-medium">"Pending"</span></li>
                      <li>This indicates you've seen the request and are processing it</li>
                    </ul>
                  </div>
                </div>

                {/* Approval and Pickup Stage */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    2. Approval and Pickup Stage
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Eye className="h-3 w-3 mr-1" />
                        Waiting for Pick-up
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Out for Rent
                      </Badge>
                    </div>
                    <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground space-y-1">
                      <li>While <span className="font-medium">"Pending"</span>, check for any scheduling conflicts or item overlaps</li>
                      <li>Verify the student isn't requesting the same clothing during overlapping dates</li>
                      <li>Once approved, change status to <span className="font-medium">"Waiting for Pick-up"</span></li>
                      <li>When the student picks up the item, change status to <span className="font-medium">"Out for Rent"</span></li>
                    </ul>
                  </div>
                </div>

                {/* Return and Cleanup Stage */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    3. Return and Cleanup Stage
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Out for Rent
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Returned
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        <Shirt className="h-3 w-3 mr-1" />
                        Ready to be Cleaned
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ready for Rent
                      </Badge>
                    </div>
                    <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground space-y-1">
                      <li>There's a <span className="font-medium">7-day buffer</span> by default after the rental period ends</li>
                      <li>You can adjust this buffer period in the <span className="font-medium">Calendar</span> tab</li>
                      <li>Once the student returns the item, change status to <span className="font-medium">"Returned"</span> in the Students tab</li>
                      <li>The attire status automatically switches to <span className="font-medium">"Ready to be Cleaned"</span></li>
                      <li>After cleaning, change the item status to <span className="font-medium">"Ready for Rent"</span></li>
                      <li>Finally, move the attire request to <span className="font-medium">"Inactive"</span> to complete the cycle</li>
                    </ul>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Important Notes
                  </h5>
                  <ul className="list-disc list-inside ml-4 text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li><span className="font-medium">Item switching is locked</span> during "Pending", "Waiting for Pick-up", and "Out for Rent" statuses</li>
                    <li><span className="font-medium">Item switching is available</span> when status is "Returned" or student is "Inactive"</li>
                    <li>Always check the <span className="font-medium">Calendar</span> for scheduling conflicts before approving requests</li>
                    <li>The buffer period helps prevent double-booking and ensures proper cleaning time</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Page-by-Page Guide */}
            <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                  How to Use Each Page
                </CardTitle>
                <CardDescription>
                  Detailed instructions for using each section of the clothing management system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Add Page */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-600" />
                    Add Page - Adding New Clothing Items
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="mb-3">
                      <Badge className="bg-red-100 text-red-800 border-red-200 mb-2">
                        ⚠️ Important: Upload Image First
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-3">
                        The image MUST be uploaded before entering item details to ensure proper connection.
                      </p>
                    </div>
                    <ol className="list-decimal list-inside ml-4 text-sm text-muted-foreground space-y-2">
                      <li><span className="font-medium">Upload Image First:</span> Start by uploading the clothing item's image</li>
                      <li><span className="font-medium">Enter Item Name:</span> Provide a clear, descriptive name for the clothing item</li>
                      <li><span className="font-medium">Select Size:</span> Choose the appropriate size (XS, S, M, L, XL, etc.)</li>
                      <li><span className="font-medium">Choose Gender:</span> Select the target gender (Men's, Women's, Unisex)</li>
                      <li><span className="font-medium">Pick Category:</span> Select the clothing category (Formal, Casual, Accessories, etc.)</li>
                      <li><span className="font-medium">Submit:</span> Complete the form to add the item to inventory</li>
                    </ol>
                  </div>
                </div>

                {/* View Page */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    View Page - Managing Item Status
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-muted-foreground mb-3">
                      This page is where you manage the lifecycle of clothing items after they've been returned.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          <Shirt className="h-3 w-3 mr-1" />
                          Ready to be Cleaned
                        </Badge>
                        <span className="text-sm text-muted-foreground">→</span>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready for Rent
                        </Badge>
                      </div>
                      <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground space-y-1">
                        <li>When items are returned, they automatically show as <span className="font-medium">"Ready to be Cleaned"</span></li>
                        <li>After cleaning is complete, change the status to <span className="font-medium">"Ready for Rent"</span></li>
                        <li>This ensures items are properly cleaned before being available for new rentals</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Edit Page */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Edit className="h-4 w-4 text-purple-600" />
                    Edit Page - Content Management
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-muted-foreground mb-3">
                      This page allows you to modify the content displayed on the home page.
                    </p>
                    <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground space-y-1">
                      <li>Update welcome messages, announcements, or system information</li>
                      <li>Modify any text content that appears on the main dashboard</li>
                      <li>Changes are reflected immediately on the home page</li>
                    </ul>
                  </div>
                </div>

                {/* Calendar Page */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    Calendar Page - Visual Rental Tracking
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Filter Options (Located at Top):</h5>
                      <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground space-y-1">
                        <li><span className="font-medium">Student Filter:</span> View rentals for specific students</li>
                        <li><span className="font-medium">Status Filter:</span> Filter by rental status (Pending, Out for Rent, etc.)</li>
                        <li><span className="font-medium">Attire Filter:</span> Focus on specific clothing items</li>
                        <li><span className="font-medium">Double Booking Check:</span> Perfect for verifying no scheduling conflicts</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Calendar Views:</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            📅 Buffer + Rental
                          </Badge>
                          <span className="text-sm text-muted-foreground">Shows rental dates plus buffer period</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            📅 Rental Only
                          </Badge>
                          <span className="text-sm text-muted-foreground">Shows only the actual rental period</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Student Attire Requests (Below Calendar):</h5>
                      <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground space-y-1">
                        <li>Detailed list of each student's attire requests</li>
                        <li>Shows rental dates, status, and item details</li>
                        <li>Helps with planning and conflict resolution</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                  <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Pro Tips
                  </h5>
                  <ul className="list-disc list-inside ml-4 text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                    <li>Always use the Calendar view to check for double bookings before approving requests</li>
                    <li>Upload images first in the Add page to ensure proper item-detail connection</li>
                    <li>Use the filter options in Calendar to quickly identify scheduling conflicts</li>
                    <li>Regularly update item status in the View page to maintain accurate inventory</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

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
