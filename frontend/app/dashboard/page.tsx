import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AttireUploadForm from "@/components/attires/add-attire";
import ViewTable from "@/components/attires/view-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  List,
} from "lucide-react";
import Link from "next/link";

async function getStatistics() {
  const supabase = await createClient();

  try {
    // Get total students count
    const { count: totalStudents } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });

    // Get total attire count
    const { count: totalAttire } = await supabase
      .from("attires")
      .select("*", { count: "exact", head: true });

    // Get total attire requests
    const { count: totalRequests } = await supabase
      .from("attire_requests")
      .select("*", { count: "exact", head: true });

    // Get pending requests
    const { count: pendingRequests } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Get approved requests
    const { count: approvedRequests } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "Approved");

    // Get active requests (approved and within date range)
    const today = new Date().toISOString().split("T")[0];
    const { count: activeRequests } = await supabase
      .from("attire_requests")
      .select("*", { count: "exact", head: true })
      // .eq("status", "approved")
      .lte("use_start_date", today)
      .gte("use_end_date", today);

    return {
      totalStudents: totalStudents || 0,
      totalAttire: totalAttire || 0,
      totalRequests: totalRequests || 0,
      pendingRequests: pendingRequests || 0,
      approvedRequests: approvedRequests || 0,
      activeRequests: activeRequests || 0,
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {
      totalStudents: 0,
      totalAttire: 0,
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      activeRequests: 0,
    };
  }
}

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const stats = await getStatistics();

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
          <div className="@container/main flex flex-1 flex-col gap-4 p-6">
            {/* Welcome Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Manage your Dress for Success program</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Link href="/calendar">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Calendar View</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-[#E51937] transition-colors" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Schedule</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      View and manage attire schedules
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/students">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Student Records</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground group-hover:text-[#E51937] transition-colors" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Manage</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      View and manage student information
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/attire/add">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Add Attire</CardTitle>
                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-[#E51937] transition-colors" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Upload</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Add new items to inventory
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/attire/list">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">View Inventory</CardTitle>
                    <List className="h-4 w-4 text-muted-foreground group-hover:text-[#E51937] transition-colors" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Browse</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      View all available attire
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Statistics Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Program Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-[#E51937]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Registered students
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Attire</CardTitle>
                    <Package className="h-4 w-4 text-[#E51937]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAttire}</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Items in inventory
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    <TrendingUp className="h-4 w-4 text-[#E51937]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalRequests}</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      All-time requests
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Request Status */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Request Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.pendingRequests}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Awaiting approval
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.approvedRequests}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Approved requests
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.activeRequests}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Currently in use
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <ViewTable />
            </div>

            {/* Add Attire Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Add New Attire</h2>
              <AttireUploadForm />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}