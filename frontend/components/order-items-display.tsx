// src/components/order-items-display.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package } from "lucide-react";
import type { OrderItem } from "@/types/students";
import {
  useAttires,
  useAttireRequestDates,
  type AttireWithUrl,
  type AttireRequestDate,
} from "@/hooks/use-attires";

interface OrderItemsDisplayProps {
  studentId: string;
  orderItems: OrderItem[];
}

export function OrderItemsDisplay({
  studentId,
  orderItems,
}: OrderItemsDisplayProps) {
  const {
    attires,
    loading: loadingAttires,
    error: errorAttires,
  } = useAttires();

  const {
    requests: allRequests,
    loadingRequests,
    errorRequests,
  } = useAttireRequestDates();

  // Combined loading / error state
  const loading = loadingAttires || loadingRequests;
  const error = errorAttires || errorRequests;

  // If no order items at all
  if (!orderItems || orderItems.length === 0) {
    return <span className="text-muted-foreground text-sm">No items</span>;
  }

  // Find the AttireWithUrl for a given orderItem
  const findAttireForOrderItem = (
    orderItem: OrderItem
  ): AttireWithUrl | null => {
    return (
      attires.find(
        (attire) =>
          attire.id === orderItem.item_id || attire.name === orderItem.item_name
      ) || null
    );
  };

  // Find the date record from "attire_requests" matching this student + this attire_id
  const findDatesForOrderItem = (
    orderItem: OrderItem
  ): AttireRequestDate | null => {
    return (
      allRequests.find(
        (r) => r.student_id === studentId && r.attire_id === orderItem.item_id
      ) || null
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="mr-2 h-4 w-4" />
          {orderItems.length} {orderItems.length === 1 ? "item" : "items"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Items</DialogTitle>
          <DialogDescription>
            List of items ordered by this student.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground">
                Loading items...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                Error loading items: {error}
              </div>
            ) : (
              orderItems.map((item, index) => {
                const matchingAttire = findAttireForOrderItem(item);
                const matchingDates = findDatesForOrderItem(item);

                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 rounded-lg border p-4"
                  >
                    {/* Image */}
                    <div className="relative h-20 w-16 flex-shrink-0">
                      <img
                        src={
                          matchingAttire?.imageUrl ||
                          "/placeholder.svg?height=80&width=64"
                        }
                        alt={`${item.item_name} image`}
                        className="rounded-md object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/placeholder.svg?height=80&width=64";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      {/* Item name */}
                      <h4 className="text-sm font-medium">{item.item_name}</h4>

                      {/* Size & Category badges */}
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge variant="outline">{item.size}</Badge>
                        {matchingAttire?.category && (
                          <Badge variant="secondary">
                            {matchingAttire.category}
                          </Badge>
                        )}
                      </div>

                      {/* Gender */}
                      {matchingAttire?.gender && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {matchingAttire.gender}
                        </p>
                      )}

                      {matchingDates ? (
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <p>
                            <strong>Use Start:</strong>{" "}
                            {matchingDates.use_start_date
                              ? new Date(
                                  matchingDates.use_start_date
                                ).toLocaleDateString()
                              : "TBD"}
                          </p>
                          <p>
                            <strong>Use End:</strong>{" "}
                            {matchingDates.use_end_date
                              ? new Date(
                                  matchingDates.use_end_date
                                ).toLocaleDateString()
                              : "TBD"}
                          </p>
                          <p>
                            <strong>Pick Up:</strong>{" "}
                            {matchingDates.pickup_date
                              ? new Date(
                                  matchingDates.pickup_date
                                ).toLocaleDateString()
                              : "TBD"}
                          </p>
                          <p>
                            <strong>Return:</strong>{" "}
                            {matchingDates.return_date
                              ? new Date(
                                  matchingDates.return_date
                                ).toLocaleDateString()
                              : "TBD"}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground">
                          No request dates found.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
