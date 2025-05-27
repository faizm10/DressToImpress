import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AttireUploadForm from "@/components/add-attire";
import ViewTable from "@/components/view-table";
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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                <Link href="/calendar">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Calendar View
                      </CardTitle>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Schedule</div>
                      <CardDescription className="text-xs text-muted-foreground">
                        View attire request schedules and availability
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/students">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Student Records
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Manage</div>
                      <CardDescription className="text-xs text-muted-foreground">
                        View and manage student information and requests
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Students
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalStudents}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Registered students in the system
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Available Attire
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalAttire}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Total attire items in inventory
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Requests
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalRequests}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      All-time attire requests submitted
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Requests
                    </CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.pendingRequests}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Requests awaiting approval
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Approved Requests
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.approvedRequests}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Requests that have been approved
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Today
                    </CardTitle>
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.activeRequests}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Attire currently in use today
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <AttireUploadForm />
              <ViewTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
