import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package } from "lucide-react";
import type { OrderItem } from "@/types/students";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface OrderItemsFormProps {
  orderItems: OrderItem[];
  onChange: (orderItems: OrderItem[]) => void;
}

export function OrderItemsForm({ orderItems, onChange }: OrderItemsFormProps) {
  const [newItem, setNewItem] = useState<Partial<OrderItem>>({
    file: "",
    size: "No Size",
    item_id: "",
    item_name: "",
    status: "",
  });

  const handleStatusChange = async (index: number, newStatus: string) => {
    const updatedItems = [...orderItems];
    const itemToUpdate = updatedItems[index];
    itemToUpdate.status = newStatus;
    onChange(updatedItems);

    if (!itemToUpdate.item_id) return;
    //call the supabase to update the item's status seperately
    const { error } = await supabase
      .from("attires")
      .update({ status: newStatus })
      .eq("file_name", itemToUpdate.file);

    if (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Order Items</Label>
        <span className="text-sm text-muted-foreground">
          {orderItems.length} items
        </span>
      </div>

      {orderItems.length > 0 && (
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4 space-y-2">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                    <Package className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.item_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} • ID: {item.item_id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
                <Select
                  value={item.status}
                  onValueChange={(value) => handleStatusChange(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue>{item.status || "Select status"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
