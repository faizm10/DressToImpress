"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { AttireGrid } from "./product-grid";
import { CartDrawer } from "./cart-drawer";
import { AttireModel } from "./product-modal";
import { TopBar } from "./top-bar";
import { type CartItem, Attire } from "./data";
import { useAttires } from "@/hooks/use-attires";
import { AttireWithUrl } from "@/hooks/use-attires";
export default function MinimalShop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { attires, loading, error } = useAttires();

  const [selectedAttire, setSelectedAttire] = useState<AttireWithUrl | null>(
    null
  );

  const addToCart = (attire: Attire, quantity: number = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === attire.id);
      if (exists) {
        return prev.map((item) =>
          item.id === attire.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...attire, quantity }];
    });
  };
  const removeFromCart = (attireID: string) => {
    setCart((prev) => prev.filter((item) => item.id !== attireID));
  };

  const filteredAttires = attires.filter((attire) =>
    attire.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950">
      <TopBar
        cartItemCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
      />

      <div className="mx-auto px-2 pt-12 pb-16">
        <AttireGrid
          attires={filteredAttires}
          onAttireSelect={setSelectedAttire}
        />
      </div>

      <AnimatePresence>
        {selectedAttire && (
          <AttireModel
            attire={selectedAttire}
            onClose={() => setSelectedAttire(null)}
            onAddToCart={(attire) => {
              addToCart(attire);
              setSelectedAttire(null);
              setIsCartOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setIsCartOpen(false)}
            onRemoveFromCart={removeFromCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
