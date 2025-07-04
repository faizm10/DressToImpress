"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AddStudentModal } from "./add-student-modal";
import { EditStudentModal } from "./edit-student-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { OrderItemsDisplay } from "../order-items-display";
import type { Student } from "@/types/students";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StudentsTable() {
  const supabase = createClient();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Fetch students from Supabase
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Calculate range for pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Build query with attire_requests join
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
        { count: "exact" }
      );

      // Add search if provided
      if (searchQuery) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,student_id.ilike.%${searchQuery}%`
        );
      }

      // Add pagination
      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setStudents(data as Student[]);
      if (count !== null) setTotalCount(count);
    } catch (error: any) {
      toast("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch on page/search change
  useEffect(() => {
    fetchStudents();
  }, [page, searchQuery]);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Handle individual checkbox selection
  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchStudents();
  };

  // Delete a student
  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id);

      if (error) throw error;

      toast("Student deleted successfully");

      fetchStudents();
    } catch (error: any) {
      toast("Error deleting student");
    }
  };

  // Delete multiple students
  const deleteMultipleStudents = async () => {
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .in("id", selectedStudents);

      if (error) throw error;

      toast(`${selectedStudents.length} students deleted successfully`);

      setSelectedStudents([]);
      fetchStudents();
    } catch (error: any) {
      toast("Error deleting students");
    }
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete);
      setStudentToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // Handle bulk delete confirmation
  const confirmBulkDelete = () => {
    if (selectedStudents.length > 0) {
      deleteMultipleStudents();
      setBulkDeleteDialogOpen(false);
    }
  };

  // Handle status change
  const handleSelectChange = async (
    field: string,
    value: string,
    studentId: string
  ) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({ [field]: value })
        .eq("id", studentId);

      if (error) throw error;

      toast(`Student ${field} updated successfully`);
      fetchStudents(); // Refresh the table
    } catch (error: any) {
      toast(`Error updating student ${field}`);
    }
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="space-y-6">
      {/* Search and Actions Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-4 flex-1">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-9 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#E51937] focus:ring-[#E51937]/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Button
            type="submit"
            variant="outline"
            onClick={handleSearch}
            className="h-10 hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
          >
            Search
          </Button>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="h-10 bg-[#E51937] hover:bg-[#E51937]/90 text-white transition-colors"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <TableHead className="w-[80px]">Student ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Order Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={`loading-${index}`} className="animate-pulse">
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[180px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : students.length > 0 ? (
              students.map((student) => {
                const reqs = student.attire_requests || [];
                let earliestStart: Date | null = null;
                let latestEnd: Date | null = null;

                if (reqs.length > 0) {
                  const starts = reqs.map((r) =>
                    new Date(r.use_start_date).getTime()
                  );
                  const ends = reqs.map((r) =>
                    new Date(r.use_end_date).getTime()
                  );
                  earliestStart = new Date(Math.min(...starts));
                  latestEnd = new Date(Math.max(...ends));
                }

                return (
                  <TableRow
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {student.student_id}
                    </TableCell>
                    <TableCell>{student.first_name}</TableCell>
                    <TableCell>{student.last_name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell>
                      <OrderItemsDisplay
                        studentId={student.id}
                        orderItems={student.order_items || []}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={student.status || "Pending"}
                        onValueChange={(value) =>
                          handleSelectChange("status", value, student.id)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Pending" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Approved">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Approved
                            </div>
                          </SelectItem>
                          <SelectItem value="Pending">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              Pending
                            </div>
                          </SelectItem>
                          <SelectItem value="Suspended">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              Suspended
                            </div>
                          </SelectItem>
                          <SelectItem value="Inactive">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-500 rounded-full" />
                              Inactive
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {earliestStart
                        ? earliestStart.toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {latestEnd ? latestEnd.toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
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
                              setCurrentStudent(student);
                              setEditModalOpen(true);
                            }}
                            className="cursor-pointer hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit student
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onClick={() => {
                              setStudentToDelete(student.id)
                              setDeleteDialogOpen(true)
                            }}
                            className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete student
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-muted-foreground"
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong>{" "}
            of <strong>{totalCount}</strong> students
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="h-8 hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm font-medium">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="h-8 hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={fetchStudents}
      />

      {/* Edit Student Modal */}
      {currentStudent && (
        <EditStudentModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          student={currentStudent}
          onSuccess={fetchStudents}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              student record.
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

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedStudents.length} student records.
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
  );
}
