"use client"

import { AnimatePresence } from "motion/react"
import { useState, useMemo } from "react"

import { AttireGrid } from "./product-grid"
import { CartDrawer } from "./cart-drawer"
import { AttireModel } from "./product-modal"
import { TopBar } from "./top-bar"
import { FilterSidebar } from "./filter-sidebar"
import type { FilterOptions, SortOption } from "@/components/filter-sort-bar"
import type { CartItem } from "./cart-drawer"
import { useAttires, type AttireWithUrl } from "@/hooks/use-attires"
import type { DateRange } from "@/components/ui/custom-calendar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function MinimalShop() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { attires, loading, error } = useAttires()
  const [selectedAttire, setSelectedAttire] = useState<AttireWithUrl | null>(null)

  // Filter and sort states
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    gender: null,
    size: null,
  })
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")

  const addToCart = (attire: AttireWithUrl, dateRange?: DateRange) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === attire.id)
      if (exists) {
        return prev.map((item) =>
          item.id === attire.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                dateRange: dateRange || item.dateRange,
              }
            : item,
        )
      }

      const newItem: CartItem = {
        id: attire.id,
        name: attire.name,
        gender: attire.gender,
        size: attire.size,
        category: attire.category,
        file_name: attire.file_name,
        imageUrl: attire.imageUrl || undefined,
        quantity: 1,
        dateRange,
      }

      return [...prev, newItem]
    })
  }

  const removeFromCart = (attireID: string) => {
    setCart((prev) => prev.filter((item) => item.id !== attireID))
  }

  // Extract unique values for filter options
  const categories = useMemo(() => {
    return [...new Set(attires.map((attire) => attire.category))]
  }, [attires])

  const genders = useMemo(() => {
    return [...new Set(attires.map((attire) => attire.gender))]
  }, [attires])

  const sizes = useMemo(() => {
    return [...new Set(attires.map((attire) => attire.size))]
  }, [attires])

  // Apply filters and search
  const filteredAttires = useMemo(() => {
    return attires.filter((attire) => {
      // Apply search filter
      const matchesSearch = attire.name.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false

      // Apply category filter
      if (filters.category && attire.category !== filters.category) return false

      // Apply gender filter
      if (filters.gender && attire.gender !== filters.gender) return false

      // Apply size filter
      if (filters.size && attire.size !== filters.size) return false

      return true
    })
  }, [attires, searchQuery, filters])

  // Apply sorting
  const sortedAttires = useMemo(() => {
    return [...filteredAttires].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "newest":
          return b.id.localeCompare(a.id)
        case "oldest":
          return a.id.localeCompare(b.id)
        default:
          return 0
      }
    })
  }, [filteredAttires, sortOption])

  const clearFilters = () => {
    setFilters({
      category: null,
      gender: null,
      size: null,
    })
  }

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length
  }, [filters])

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950">
      <SidebarProvider>
        <FilterSidebar
          categories={categories}
          genders={genders}
          sizes={sizes}
          filters={filters}
          sortOption={sortOption}
          onFilterChange={setFilters}
          onSortChange={setSortOption}
          onClearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
          resultCount={sortedAttires.length}
        />

        <SidebarInset>
          <TopBar cartItemCount={cart.length} onCartClick={() => setIsCartOpen(true)} onSearch={setSearchQuery} />

          <div className="mx-auto px-4 pt-4 pb-16 max-w-7xl">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading attires...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-red-500">Error loading attires</p>
              </div>
            ) : sortedAttires.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">No attires found matching your criteria</p>
              </div>
            ) : (
              <AttireGrid attires={sortedAttires} onAttireSelect={setSelectedAttire} />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      <AnimatePresence>
        {selectedAttire && (
          <AttireModel
            attire={selectedAttire}
            onClose={() => setSelectedAttire(null)}
            onAddToCart={(attire, dateRange) => {
              addToCart(attire, dateRange)
              setSelectedAttire(null)
              setIsCartOpen(true)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer cart={cart} onClose={() => setIsCartOpen(false)} onRemoveFromCart={removeFromCart} />
        )}
      </AnimatePresence>
    </div>
  )
}
