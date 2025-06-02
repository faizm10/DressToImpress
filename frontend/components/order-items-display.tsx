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
import { Package, Calendar, Clock, ArrowRight } from "lucide-react";
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
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Package className="h-4 w-4" />
        <span className="text-sm">No items</span>
      </div>
    );
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
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-accent/50 transition-colors"
        >
          <Package className="h-4 w-4" />
          <span className="font-medium">{orderItems.length}</span>
          <span className="text-muted-foreground">
            {orderItems.length === 1 ? "item" : "items"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-primary" />
            Order Items
          </DialogTitle>
          <DialogDescription className="text-base">
            Detailed view of all items ordered by this student with dates and
            specifications.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading items...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="rounded-full bg-red-100 p-3">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-red-600 font-medium">Error loading items</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            ) : (
              orderItems.map((item, index) => {
                const matchingAttire = findAttireForOrderItem(item);
                const matchingDates = findDatesForOrderItem(item);

                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-border"
                  >
                    <div className="flex gap-6">
                      {/* Enhanced Image Section */}
                      <div className="relative flex-shrink-0">
                        <div className="relative h-32 w-24 overflow-hidden rounded-lg bg-muted shadow-md border border-border">
                          <img
                            src={
                              matchingAttire?.imageUrl ||
                              "/placeholder.svg?height=128&width=96" ||
                              "/placeholder.svg"
                            }
                            alt={`${item.item_name} image`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/placeholder.svg?height=128&width=96";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Enhanced Details Section */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.item_name}
                          </h4>

                          {/* Enhanced Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="default"
                              className="bg-primary/10 text-primary border-primary/20"
                            >
                              Size {item.size}
                            </Badge>
                            {matchingAttire?.category && (
                              <Badge
                                variant="secondary"
                                className="bg-secondary/50"
                              >
                                {matchingAttire.category}
                              </Badge>
                            )}
                            {matchingAttire?.gender && (
                              <Badge variant="outline" className="text-xs">
                                {matchingAttire.gender}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Enhanced Dates Section */}
                        {matchingDates ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-700">
                                  Usage Period
                                </span>
                              </div>
                              <div className="pl-6 space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground">
                                    Start:
                                  </span>
                                  <span className="font-medium">
                                    {matchingDates.use_start_date
                                      ? new Date(
                                          matchingDates.use_start_date
                                        ).toLocaleDateString()
                                      : "TBD"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground">
                                    End:
                                  </span>
                                  <span className="font-medium">
                                    {matchingDates.use_end_date
                                      ? new Date(
                                          matchingDates.use_end_date
                                        ).toLocaleDateString()
                                      : "TBD"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-700">
                                  Logistics
                                </span>
                              </div>
                              <div className="pl-6 space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground">
                                    Pick up:
                                  </span>
                                  <span className="font-medium">
                                    {matchingDates.pickup_date
                                      ? new Date(
                                          matchingDates.pickup_date
                                        ).toLocaleDateString()
                                      : "TBD"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground">
                                    Return:
                                  </span>
                                  <span className="font-medium">
                                    {matchingDates.return_date
                                      ? new Date(
                                          matchingDates.return_date
                                        ).toLocaleDateString()
                                      : "TBD"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              No request dates available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subtle hover indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
