"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Mail, Package, Trash2, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { OrderItem, Student, AttireRequest } from "@/types/students";

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onSuccess?: () => void;
}

export function EditStudentModal({
  open,
  onOpenChange,
  student,
  onSuccess,
}: EditStudentModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    student_id: "",
    email: "",
    status: "",
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [pickupDate, setPickupDate] = React.useState<Date>();
  const [dropoffDate, setDropoffDate] = React.useState<Date>();
  const [attireRequests, setAttireRequests] = useState<any[]>([]);
  const [availableAttires, setAvailableAttires] = useState<any[]>([]);
  const [loadingAttires, setLoadingAttires] = useState(false);
  const [attireSearchQuery, setAttireSearchQuery] = useState("");

  // Fetch attire requests and available attires
  const fetchAttireData = async () => {
    if (!student) return;
    
    setLoadingAttires(true);
    try {
      // Fetch student's attire requests
      const { data: requestsData, error: requestsError } = await supabase
        .from("attire_requests")
        .select(`
          *,
          attires (
            id,
            name,
            size,
            gender,
            category
          )
        `)
        .eq("student_id", student.id);

      if (requestsError) throw requestsError;

      // Fetch only attires that are ready for rent
      const { data: attiresData, error: attiresError } = await supabase
        .from("attires")
        .select("*")
        .eq("status", "Ready for Rent")
        .order("name", { ascending: true });

      if (attiresError) throw attiresError;

      setAttireRequests(requestsData || []);
      setAvailableAttires(attiresData || []);
    } catch (error: any) {
      toast.error("Error fetching attire data");
      console.error("Error:", error);
    } finally {
      setLoadingAttires(false);
    }
  };

  // Set initial form data when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        student_id: student.student_id,
        email: student.email,
        status: student.status,
      });
      setOrderItems(student.order_items || []);
      setAttireSearchQuery(""); // Clear search when student changes
      fetchAttireData();
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("students")
        .update({
          ...formData,
          order_items: orderItems,
          updated_at: new Date().toISOString(),
        })
        .eq("id", student.id);

      if (error) throw error;

      toast.success("Student updated successfully");

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendPickupEmail = () => {
    // TODO: Implement pickup email functionality
    toast.success("Pickup email sent successfully");
  };

  const handleSendDropoffEmail = () => {
    // TODO: Implement dropoff email functionality
    toast.success("Dropoff email sent successfully");
  };

  const handleUpdateAttireRequest = async (requestId: string, newAttireId: string) => {
    // Find the request to check its status
    const request = attireRequests.find(req => req.id === requestId);
    if (!request) {
      toast.error("Request not found");
      return;
    }

    // Check if switching is allowed
    if (!isItemSwitchingAllowed(request.status)) {
      toast.error("Cannot switch items when rental is active. Only available when status is 'Returned' or student is 'Inactive'");
      return;
    }

    try {
      const { error } = await supabase
        .from("attire_requests")
        .update({ 
          attire_id: newAttireId,
          updated_at: new Date().toISOString()
        })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Attire updated successfully");
      fetchAttireData(); // Refresh the data
    } catch (error: any) {
      toast.error("Error updating attire");
      console.error("Error:", error);
    }
  };

  // Check if item switching is allowed based on rental status
  const isItemSwitchingAllowed = (requestStatus: string) => {
    // Allow switching if rental status is "Returned" or student status is "Inactive"
    return requestStatus === "Returned" || formData.status === "Inactive";
  };

  const handleDeleteAttireRequest = async (requestId: string) => {
    // Find the request to check its status
    const request = attireRequests.find(req => req.id === requestId);
    if (!request) {
      toast.error("Request not found");
      return;
    }

    // Check if deletion is allowed
    if (!isItemSwitchingAllowed(request.status)) {
      toast.error("Cannot delete item when rental is active. Only available when status is 'Returned' or student is 'Inactive'");
      return;
    }

    try {
      const { error } = await supabase
        .from("attire_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Attire request deleted successfully");
      fetchAttireData(); // Refresh the data
    } catch (error: any) {
      toast.error("Error deleting attire request");
      console.error("Error:", error);
    }
  };

  // Filter attires based on search query
  const filteredAttires = availableAttires.filter((attire) => {
    const searchLower = attireSearchQuery.toLowerCase();
    return (
      attire.name?.toLowerCase().includes(searchLower) ||
      attire.category?.toLowerCase().includes(searchLower) ||
      attire.size?.toLowerCase().includes(searchLower) ||
      attire.gender?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl">Edit Rental</DialogTitle>
            <DialogDescription>
              Update the rental details and manage pickup/dropoff schedules.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_id">Phone #</Label>
                  <Input
                    id="student_id"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="Enter phone #"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Rental Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="Approved">
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
                    </SelectItem> */}
                    <SelectItem value="Inactive">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Schedule Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Schedule Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pickup Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !pickupDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {pickupDate
                          ? format(pickupDate, "PPP")
                          : "Select pickup date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={pickupDate}
                        onSelect={setPickupDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Dropoff Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dropoffDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dropoffDate
                          ? format(dropoffDate, "PPP")
                          : "Select dropoff date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dropoffDate}
                        onSelect={setDropoffDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Separator />

            {/* Attire Management Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Clothing Management
              </h3>
              
              {loadingAttires ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E51937] mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading clothing data...</p>
                  </div>
                </div>
              ) : attireRequests.length > 0 ? (
                <div className="space-y-4">
                  {attireRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Package className="h-4 w-4 text-[#E51937]" />
                          <span className="font-medium">Current Item:</span>
                          <Badge variant="outline">
                            {request.attires?.name || "Unknown"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={cn(
                            request.status === "approved" && "bg-green-100 text-green-800 border-green-200",
                            request.status === "pending" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                            request.status === "rejected" && "bg-red-100 text-red-800 border-red-200",
                            request.status === "returned" && "bg-blue-100 text-blue-800 border-blue-200"
                          )}>
                            {request.status}
                          </Badge>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAttireRequest(request.id)}
                            disabled={!isItemSwitchingAllowed(request.status)}
                            className={cn(
                              "h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50",
                              !isItemSwitchingAllowed(request.status) && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Change to:</Label>
                          <Select
                            value={request.attire_id}
                            onValueChange={(value) => handleUpdateAttireRequest(request.id, value)}
                            disabled={!isItemSwitchingAllowed(request.status)}
                          >
                            <SelectTrigger className={cn(
                              !isItemSwitchingAllowed(request.status) && "opacity-50 cursor-not-allowed"
                            )}>
                              <SelectValue placeholder={
                                isItemSwitchingAllowed(request.status) 
                                  ? "Select new clothing" 
                                  : "Item switching not available"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Search Input */}
                              <div className="flex items-center px-3 py-2 border-b">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <Input
                                  placeholder="Search clothing..."
                                  value={attireSearchQuery}
                                  onChange={(e) => setAttireSearchQuery(e.target.value)}
                                  className="border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                              {/* Attire Options */}
                              {filteredAttires.length > 0 ? (
                                filteredAttires.map((attire) => (
                                  <SelectItem key={attire.id} value={attire.id}>
                                    <div className="flex items-center space-x-2">
                                      <span>{attire.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {attire.size}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {attire.category}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  No attires found matching "{attireSearchQuery}"
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          {!isItemSwitchingAllowed(request.status) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Item switching is only available when rental status is "Returned" or student is "Inactive"
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Rental Period:</Label>
                          <div className="text-sm text-muted-foreground">
                            {request.use_start_date && request.use_end_date ? (
                              <span>
                                {request.use_start_date} - {request.use_end_date}
                              </span>
                            ) : (
                              <span>No dates set</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {request.attires && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Size:</span>
                              <Badge variant="outline" className="ml-2">
                                {request.attires.size}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">Category:</span>
                              <Badge variant="outline" className="ml-2">
                                {request.attires.category}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">Gender:</span>
                              <Badge variant="outline" className="ml-2">
                                {request.attires.gender}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No attire requests found for this student.</p>
                </div>
              )}
            </div>

          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}