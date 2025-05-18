import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Plus, Trash2, X } from "lucide-react";
import type { OrderItem } from "@/types/students";

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
  });

  const handleAddItem = () => {
    if (!newItem.item_name || !newItem.item_id) return;

    const updatedItems = [
      ...orderItems,
      {
        file: newItem.file || "",
        size: newItem.size || "No Size",
        item_id: newItem.item_id,
        item_name: newItem.item_name,
      },
    ];

    onChange(updatedItems);

    // Reset form
    setNewItem({
      file: "",
      size: "No Size",
      item_id: "",
      item_name: "",
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    onChange(updatedItems);
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  className="h-8 w-8 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="item_name" className="text-xs">
              Item Name
            </Label>
            <Input
              id="item_name"
              name="item_name"
              value={newItem.item_name}
              onChange={handleItemChange}
              placeholder="Dress Pants"
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="size" className="text-xs">
              Size
            </Label>
            <Input
              id="size"
              name="size"
              value={newItem.size}
              onChange={handleItemChange}
              placeholder="No Size"
              className="h-8"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="item_id" className="text-xs">
              Item ID
            </Label>
            <Input
              id="item_id"
              name="item_id"
              value={newItem.item_id}
              onChange={handleItemChange}
              placeholder="Item ID"
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="file" className="text-xs">
              File (Optional)
            </Label>
            <Input
              id="file"
              name="file"
              value={newItem.file}
              onChange={handleItemChange}
              placeholder="File UUID"
              className="h-8"
            />
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleAddItem}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div> */}
    </div>
  );
}
