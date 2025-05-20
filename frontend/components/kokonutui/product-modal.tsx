"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";
import { AttireWithUrl } from "@/hooks/use-attires"; // use correct path
import { Badge } from "../ui/badge";

interface AttireModelProps {
  attire: AttireWithUrl;
  onClose: () => void;
  onAddToCart: (attire: AttireWithUrl) => void;
}

export function AttireModel({
  attire,
  onClose,
  onAddToCart,
}: AttireModelProps) {
  const [quantity, setQuantity] = useState(1);

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
        layoutId={`product-${attire.id}`}
        className="fixed inset-x-4 bottom-0 md:inset-[25%] z-50 bg-white dark:bg-zinc-900 rounded-t-xl md:rounded-xl overflow-hidden max-h-[80vh] md:max-h-[500px]"
      >
        <div className="h-full md:flex">
          <div className="relative md:w-2/5">
            <img
              src={attire.imageUrl ?? "/placeholder.png"}
              alt={attire.name}
              className="w-full h-[200px] md:h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 md:w-3/5 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-sm font-medium">{attire.name}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {attire.category}
                  </p>
                </div>
                <p className="text-sm font-medium">{attire.gender}</p>
                <Badge className="bg-green-500">
                  {attire.status ?? "Available"}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  {attire.size}
                </p>
              </div>
            </div>
            <button
              onClick={() => onAddToCart(attire)}
              className="w-full mt-3 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
