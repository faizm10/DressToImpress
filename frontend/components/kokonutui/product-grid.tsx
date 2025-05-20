import { motion } from "motion/react";

import { AttireWithUrl } from "@/hooks/use-attires";

interface AttireGridProps {
  attires: AttireWithUrl[];
  onAttireSelect: (attire: AttireWithUrl) => void;
}

// export function ProductGrid({ products, onProductSelect }: ProductGridProps) {
export function AttireGrid({ attires, onAttireSelect }: AttireGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
      {attires.map((attire) => (
        <motion.div
          key={attire.id}
          layoutId={`product-${attire.id}`}
          onClick={() => onAttireSelect(attire)}
          className="group cursor-pointer"
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="aspect-[4/5] bg-white dark:bg-zinc-900 rounded-md overflow-hidden">
            <img
              src={attire.imageUrl ?? "/placeholder.png"}
              alt={attire.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="mt-1.5 space-y-0.5">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-medium truncate">{attire.name}</h3>
              <h3 className="text-xs font-medium truncate">{attire.status ?? "Available"}</h3>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {attire.gender}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                {attire.category}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
