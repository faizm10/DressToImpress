"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  Edit2,
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { AddStudentModal } from "./add-student-modal"
import { EditStudentModal } from "./edit-student-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { OrderItemsDisplay } from "../order-items-display"
import type { Student } from "@/types/students"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAttires } from "@/hooks/use-attires"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Waiting for pick-up":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Out for rent":
      return "bg-green-100 text-green-800 border-green-200"
    case "Returned":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending":
      return <Clock className="h-3 w-3" />
    case "Waiting for pick-up":
      return <AlertCircle className="h-3 w-3" />
    case "Out for rent":
      return <CheckCircle className="h-3 w-3" />
    case "Returned":
      return <CheckCircle className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

const isItemSwitchingAllowed = (rentalStatus: string, studentStatus: string) => {
  return rentalStatus === "Returned" || studentStatus === "Inactive"
}

export function StudentsTable() {
  const supabase = createSupabaseClient()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activePage, setActivePage] = useState(1)
  const [inactivePage, setInactivePage] = useState(1)
  const [limit] = useState(10)
  const [activeTotalCount, setActiveTotalCount] = useState(0)
  const [inactiveTotalCount, setInactiveTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active")

  const rentalStatuses = ["Pending", "Waiting for pick-up", "Out for rent", "Returned"] as const

  // Fetch counts for both tabs
  const fetchCounts = async () => {
    try {
      // Fetch active count
      let activeQuery = supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .neq("status", "Inactive")
      
      if (searchQuery) {
        activeQuery = activeQuery.or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,student_id.ilike.%${searchQuery}%`,
        )
      }

      const { count: activeCount } = await activeQuery

      // Fetch inactive count
      let inactiveQuery = supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("status", "Inactive")
      
      if (searchQuery) {
        inactiveQuery = inactiveQuery.or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,student_id.ilike.%${searchQuery}%`,
        )
      }

      const { count: inactiveCount } = await inactiveQuery

      if (activeCount !== null) setActiveTotalCount(activeCount)
      if (inactiveCount !== null) setInactiveTotalCount(inactiveCount)
    } catch (error: any) {
      // Silently fail for counts, main fetch will handle errors
    }
  }

  // Fetch students from Supabase
  const fetchStudents = async (tab: "active" | "inactive" = activeTab) => {
    setLoading(true)
    try {
      const currentPage = tab === "active" ? activePage : inactivePage
      const from = (currentPage - 1) * limit
      const to = from + limit - 1

      let query = supabase.from("students").select(
        `
          *,
          attire_requests (
            id,
            attire_id,
            use_start_date,
            use_end_date,
            status
          )
        `,
        { count: "exact" },
      )

      // Filter by status based on tab
      if (tab === "active") {
        query = query.neq("status", "Inactive")
      } else {
        query = query.eq("status", "Inactive")
      }

      if (searchQuery) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,student_id.ilike.%${searchQuery}%`,
        )
      }

      const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

      if (error) throw error

      setStudents(data as Student[])
      if (count !== null) {
        if (tab === "active") {
          setActiveTotalCount(count)
        } else {
          setInactiveTotalCount(count)
        }
      }
    } catch (error: any) {
      toast.error("Error fetching students")
    } finally {
      setLoading(false)
    }
  }

  // Fetch counts when search query changes
  useEffect(() => {
    fetchCounts()
  }, [searchQuery])

  // Fetch students when page or tab changes
  useEffect(() => {
    fetchStudents(activeTab)
  }, [activePage, inactivePage, activeTab])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === "active") {
      setActivePage(1)
    } else {
      setInactivePage(1)
    }
    fetchStudents(activeTab)
  }

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id)
      if (error) throw error
      toast.success("Student deleted successfully")
      fetchStudents(activeTab)
    } catch (error: any) {
      toast.error("Error deleting student")
    }
  }

  const deleteMultipleStudents = async () => {
    try {
      const { error } = await supabase.from("students").delete().in("id", selectedStudents)

      if (error) throw error
      toast.success(`${selectedStudents.length} students deleted successfully`)
      setSelectedStudents([])
      fetchStudents(activeTab)
    } catch (error: any) {
      toast.error("Error deleting students")
    }
  }

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete)
      setStudentToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const confirmBulkDelete = () => {
    if (selectedStudents.length > 0) {
      deleteMultipleStudents()
      setBulkDeleteDialogOpen(false)
    }
  }

  const handleSelectChange = async (field: string, value: string, studentId: string) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({ [field]: value })
        .eq("id", studentId)

      if (error) throw error
      toast.success(`Student ${field} updated successfully`)
      fetchStudents(activeTab)
    } catch (error: any) {
      toast.error(`Error updating student ${field}`)
    }
  }

  const currentPage = activeTab === "active" ? activePage : inactivePage
  const currentTotalCount = activeTab === "active" ? activeTotalCount : inactiveTotalCount
  const totalPages = Math.ceil(currentTotalCount / limit)
  const startItem = currentTotalCount > 0 ? (currentPage - 1) * limit + 1 : 0
  const endItem = Math.min(currentPage * limit, currentTotalCount)

  const { attires } = useAttires()

  // Students are already filtered by the query, so we can use them directly
  const activeStudents = activeTab === "active" ? students : []
  const inactiveStudents = activeTab === "inactive" ? students : []

  const renderStudentRow = (student: Student) => {
    const reqs = student.attire_requests || []
    let earliestStart: string | null = null
    let latestEnd: string | null = null

    if (reqs.length > 0) {
      // Use raw date strings from Supabase
      const startDates = reqs.map((r) => r.use_start_date).filter(Boolean)
      const endDates = reqs.map((r) => r.use_end_date).filter(Boolean)
      
      if (startDates.length > 0) {
        earliestStart = startDates.reduce((earliest, current) => 
          current < earliest ? current : earliest
        )
      }
      
      if (endDates.length > 0) {
        latestEnd = endDates.reduce((latest, current) => 
          current > latest ? current : latest
        )
      }
    }

    return (
      <TableRow
        key={student.id}
        className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all duration-200 border-b border-gray-100 dark:border-gray-800"
      >
        <TableCell className="font-semibold text-center py-4">
          <Badge variant="outline" className="font-mono text-xs">
            {student.student_id}
          </Badge>
        </TableCell>
        <TableCell className="text-center py-4 font-medium">{student.first_name}</TableCell>
        <TableCell className="text-center py-4 font-medium">{student.last_name}</TableCell>
        <TableCell className="text-center py-4 text-muted-foreground">{student.email}</TableCell>
        <TableCell className="py-4">
          <OrderItemsDisplay studentId={student.id} orderItems={student.order_items || []} />
        </TableCell>
        <TableCell className="py-4">
          {student.attire_requests && student.attire_requests.length > 0 && (
            <div className="flex flex-col gap-2">
              {student.attire_requests.map((req) => {
                const attire = attires.find((a) => a.id === req.attire_id)
                return (
                  <div
                    key={req.id}
                    className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="flex flex-col gap-1 min-w-[100px]">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {attire ? attire.name : req.attire_id}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs w-fit ${getStatusColor(req.status || "Pending")}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(req.status || "Pending")}
                            {req.status || "Pending"}
                          </span>
                        </Badge>
                        {!isItemSwitchingAllowed(req.status || "Pending", student.status) && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                            🔒 Locked
                          </Badge>
                        )}
                        {isItemSwitchingAllowed(req.status || "Pending", student.status) && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            🔓 Available
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Select
                      value={req.status || "Pending"}
                      onValueChange={async (value) => {
                        const supabase = createSupabaseClient()
                        await supabase.from("attire_requests").update({ status: value }).eq("id", req.id)
                        if (value === "Out for rent") {
                          await supabase
                            .from("attires")
                            .update({ status: "Out for Rent" })
                            .eq("id", req.attire_id)
                        }
                        if (value === "Returned") {
                          await supabase
                            .from("attires")
                            .update({ status: "Ready To be Cleaned" })
                            .eq("id", req.attire_id)
                        }
                        toast.success("Rental status updated")
                        fetchStudents(activeTab)
                      }}
                    >
                      <SelectTrigger className="w-[160px] h-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <SelectValue defaultValue={"Pending"} />
                      </SelectTrigger>
                      <SelectContent>
                        {rentalStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            <span className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              {status}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
          )}
        </TableCell>
        <TableCell className="text-center py-4 text-muted-foreground">
          {earliestStart ? (
            <Badge variant="outline" className="text-xs">
              {earliestStart}
            </Badge>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell className="text-center py-4 text-muted-foreground">
          {latestEnd ? (
            <Badge variant="outline" className="text-xs">
              {latestEnd}
            </Badge>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell className="py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-[#E51937]/10 hover:text-[#E51937] transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCurrentStudent(student)
                  setEditModalOpen(true)
                }}
                className="cursor-pointer hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Rental
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50/30 dark:bg-gray-900/30 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Student Management</h1>
          <p className="text-muted-foreground mt-1">Manage student rentals and track attire requests</p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-[#E51937] hover:bg-[#E51937]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{activeTotalCount + inactiveTotalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Rentals</p>
                <p className="text-2xl font-bold">{activeTotalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{inactiveTotalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {activeStudents.reduce((acc, student) => {
                    const pendingRequests = student.attire_requests?.filter((req) => req.status === "Pending")
                    return acc + (pendingRequests?.length || 0)
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or phone #..."
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#E51937] focus:ring-[#E51937]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <Button
              type="submit"
              onClick={handleSearch}
              variant="outline"
              className="hover:bg-[#E51937]/5 hover:text-[#E51937] hover:border-[#E51937]/20 transition-colors bg-transparent"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              className="hover:bg-[#E51937]/5 hover:text-[#E51937] hover:border-[#E51937]/20 transition-colors bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          if (value === "active" || value === "inactive") {
            setActiveTab(value)
            // Reset to page 1 when switching tabs
            if (value === "active") {
              setActivePage(1)
            } else {
              setInactivePage(1)
            }
          }
        }} 
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-900 border shadow-sm">
          <TabsTrigger value="active" className="data-[state=active]:bg-[#E51937] data-[state=active]:text-white">
            Active Rentals ({activeTotalCount})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-[#E51937] data-[state=active]:text-white">
            Inactive Rentals ({inactiveTotalCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Active Student Rentals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="text-center font-semibold py-4">Phone #</TableHead>
                      <TableHead className="text-center font-semibold py-4">First Name</TableHead>
                      <TableHead className="text-center font-semibold py-4">Last Name</TableHead>
                      <TableHead className="text-center font-semibold py-4">Email</TableHead>
                      <TableHead className="text-center font-semibold py-4">Order Items</TableHead>
                      <TableHead className="text-center font-semibold py-4">Rental Status</TableHead>
                      <TableHead className="text-center font-semibold py-4">Start Date</TableHead>
                      <TableHead className="text-center font-semibold py-4">End Date</TableHead>
                      <TableHead className="text-center font-semibold py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: limit }).map((_, index) => (
                        <TableRow key={`loading-${index}`}>
                          <TableCell className="py-4">
                            <Skeleton className="h-6 w-16 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-4 w-24 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-4 w-32 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-8 w-24 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-8 w-32 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-6 w-20 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-6 w-20 mx-auto" />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : activeStudents.length > 0 ? (
                      activeStudents.map(renderStudentRow)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Users className="h-8 w-8" />
                            <p>No active students found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Inactive Student Rentals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="text-center font-semibold py-4">Phone #</TableHead>
                      <TableHead className="text-center font-semibold py-4">First Name</TableHead>
                      <TableHead className="text-center font-semibold py-4">Last Name</TableHead>
                      <TableHead className="text-center font-semibold py-4">Email</TableHead>
                      <TableHead className="text-center font-semibold py-4">Order Items</TableHead>
                      <TableHead className="text-center font-semibold py-4">Rental Status</TableHead>
                      <TableHead className="text-center font-semibold py-4">Start Date</TableHead>
                      <TableHead className="text-center font-semibold py-4">End Date</TableHead>
                      <TableHead className="text-center font-semibold py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inactiveStudents.length > 0 ? (
                      inactiveStudents.map((student) => (
                        <TableRow
                          key={student.id}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all duration-200 border-b border-gray-100 dark:border-gray-800 opacity-75"
                        >
                          <TableCell className="font-semibold text-center py-4">
                            <Badge variant="outline" className="font-mono text-xs">
                              {student.student_id}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-4 font-medium">{student.first_name}</TableCell>
                          <TableCell className="text-center py-4 font-medium">{student.last_name}</TableCell>
                          <TableCell className="text-center py-4 text-muted-foreground">{student.email}</TableCell>
                          <TableCell className="py-4">
                            <OrderItemsDisplay studentId={student.id} orderItems={student.order_items || []} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                              <span className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Inactive
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-4 text-muted-foreground">N/A</TableCell>
                          <TableCell className="text-center py-4 text-muted-foreground">N/A</TableCell>
                          <TableCell className="text-center py-4 text-muted-foreground">-</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Users className="h-8 w-8" />
                            <p>No inactive students found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{startItem}</span> to{" "}
                <span className="font-medium">{endItem}</span> of <span className="font-medium">{currentTotalCount}</span>{" "}
                {activeTab === "active" ? "active" : "inactive"} students
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeTab === "active") {
                      setActivePage(activePage - 1)
                    } else {
                      setInactivePage(inactivePage - 1)
                    }
                  }}
                  disabled={currentPage === 1}
                  className="hover:bg-[#E51937]/5 hover:text-[#E51937] hover:border-[#E51937]/20 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeTab === "active") {
                      setActivePage(activePage + 1)
                    } else {
                      setInactivePage(inactivePage + 1)
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="hover:bg-[#E51937]/5 hover:text-[#E51937] hover:border-[#E51937]/20 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals and Dialogs */}
      <AddStudentModal open={addModalOpen} onOpenChange={setAddModalOpen} onSuccess={fetchStudents} />

      {currentStudent && (
        <EditStudentModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          student={currentStudent}
          onSuccess={fetchStudents}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedStudents.length} student records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
