"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { format, addDays } from "date-fns";
import type { DateRange } from "@/components/ui/custom-calendar";
import { toast } from "sonner";

// Update CartItem to include dateRange
export interface CartItem {
  id: string;
  name: string;
  size: string;
  gender: string;
  category: string;
  file_name: string;
  quantity: number;
  imageUrl?: string;
  dateRange?: DateRange;
}

interface CartDrawerProps {
  cart: CartItem[];
  onClose: () => void;
  onRemoveFromCart: (attireId: string) => void;
  onOrderSuccess?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  studentId?: string;
  email?: string;
}

export function CartDrawer({
  cart,
  onClose,
  onRemoveFromCart,
  onOrderSuccess,
}: CartDrawerProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Remove isSubmitted state, will be handled by parent

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user types
    if (errors[id as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else if (!/^\d+$/.test(formData.studentId)) {
      newErrors.studentId = "Student ID must be a number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.endsWith("uoguelph.ca")) {
      newErrors.email = "Email must end with uoguelph.ca";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation
    const valid = validateForm();
    if (!valid) {
      if (formData.email && !formData.email.endsWith("uoguelph.ca")) {
        toast.warning("Email address must end with uoguelph.ca");
      } else {
        toast.error("Please fill in all required fields correctly.");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      //create the order by mapping thru the customer's item and adding each details to it
      const orderItems = cart.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        size: item.size,
        file: item.file_name,
      }));

      //insert student's data
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            student_id: formData.studentId,
            email: formData.email,
            order_items: orderItems,
          },
        ])
        .select();

      if (studentError) throw studentError;

      // fetch the student ID so we can map the attires to student id when inserting with the dates
      const studentId = studentData?.[0]?.id;

      if (!studentId) throw new Error("Failed to get student ID");

      //create the request for each attires by user's ID
      const attireRequests = cart.map((item) => {
        const startDate = item.dateRange?.from;
        const endDate = item.dateRange?.to;
        return {
          student_id: studentId,
          attire_id: item.id,
          use_start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
          use_end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
        };
      });

      // Insert attire requests
      const { error: attireRequestError } = await supabase
        .from("attire_requests")
        .insert(attireRequests);

      if (attireRequestError) throw attireRequestError;

      // Update attire status
      // const updates = await Promise.all(
      //   cart.map((item) => supabase.from("attires").update({ status: "pending" }).eq("file_name", item.file_name)),
      // )

      // const updateErrors = updates.filter((res: any) => res.error)
      // if (updateErrors.length > 0) {
      //   console.error("One or more updates failed:", updateErrors)
      //   throw new Error("Failed to update item statuses")
      // }

      cart.forEach((item) => onRemoveFromCart(item.id));
      if (typeof onOrderSuccess === "function") {
        onOrderSuccess();
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    /^\d+$/.test(formData.studentId) &&
    formData.email.endsWith("uoguelph.ca") &&
    cart.length > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed right-0 z-50 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 shadow-xl"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-medium">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                Your cart is empty
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                >
                  <img
                    src={item.imageUrl ?? "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-medium truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-zinc-500">{item.size}</p>
                        {item.dateRange?.from && item.dateRange?.to && (
                          <p className="text-xs text-zinc-500 mt-1">
                            {format(item.dateRange.from, "MMM d")} -{" "}
                            {format(item.dateRange.to, "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-zinc-200 dark:border-zinc-800"
          >
            {/* Success message handled by parent modal */}
            <>
                <div className="flex space-x-2">
                  <div className="mb-4 w-1/2">
                    <Label
                      className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      htmlFor="firstName"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className={`w-full ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div className="mb-4 w-1/2">
                    <Label
                      className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      htmlFor="lastName"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className={`w-full ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="mb-4 w-1/3">
                    <Label
                      className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      htmlFor="studentId"
                    >
                      Student ID
                    </Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      placeholder="uoguelph ID"
                      className={`w-full ${
                        errors.studentId ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <div className="w-2/3">
                    <Label
                      className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      htmlFor="email"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@uoguelph.ca"
                      className={`w-full ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                {/* Checkout button */}
                <Button
                  type="submit"
                  className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-base font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </Button>
                {/* Helper message for disabled button */}
                {/* {(!isFormValid && !isSubmitting) && (
                  <p className="mt-2 text-xs text-yellow-600 text-center">
                    Please fill in all fields correctly and use your uoguelph.ca email to enable checkout.
                  </p>
                )} */}
              </>
            
          </form>
        </div>
      </motion.div>
    </>
  );
}