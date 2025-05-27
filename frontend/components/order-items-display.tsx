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
import { useAttires, type AttireWithUrl } from "@/hooks/use-attires";
interface OrderItemsDisplayProps {
  orderItems: OrderItem[];
}
export function OrderItemsDisplay({ orderItems }: OrderItemsDisplayProps) {
  const { attires, loading, error } = useAttires();

  if (!orderItems || orderItems.length === 0) {
    return <span className="text-muted-foreground text-sm">No items</span>;
  }
  // Function to find the matching attire for an order item
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
              Array.isArray(orderItems) &&
              orderItems.map((item, index) => {
                const matchingAttire = findAttireForOrderItem(item);

                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 rounded-lg border p-4"
                  >
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
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.item_name}</h4>
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge variant="outline">{item.size}</Badge>
                        {matchingAttire?.category && (
                          <Badge variant="secondary">
                            {matchingAttire.category}
                          </Badge>
                        )}
                      </div>
                      {matchingAttire?.gender && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {matchingAttire.gender}
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
