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
import Image from "next/image";
import type { OrderItem } from "@/types/students";

interface OrderItemsDisplayProps {
  orderItems: OrderItem[];
}

export function OrderItemsDisplay({ orderItems }: OrderItemsDisplayProps) {
  if (!orderItems || orderItems.length === 0) {
    return <span className="text-muted-foreground text-sm">No items</span>;
  }

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
            {Array.isArray(orderItems) &&
              orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  {/* <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                    {item.file ? (
                      <Image
                        src={`/api/file-proxy?file=${encodeURIComponent(
                          item.file
                        )}`}
                        alt={item.item_name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div> */}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.item_name}</h4>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge variant="outline">{item.size}</Badge>
                      {/* <span className="text-xs text-muted-foreground">
                        ID: {item.item_id}
                      </span> */}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
