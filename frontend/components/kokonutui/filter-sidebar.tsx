"use client"

import { Filter, ArrowUpDown, RotateCcw } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { genderOptions, sizeOptions } from "@/lib/data"
import type { FilterOptions, SortOption } from "@/components/filter-sort-bar"

interface FilterSidebarProps {
  categories: string[]
  genders: string[]
  sizes: string[]
  colors: string[]
  filters: FilterOptions
  sortOption: SortOption
  onFilterChange: (filters: FilterOptions) => void
  onSortChange: (sort: SortOption) => void
  onClearFilters: () => void
  activeFilterCount: number
  resultCount: number
}

export function FilterSidebar({
  categories,
  genders,
  sizes,
  colors,
  filters,
  sortOption,
  onFilterChange,
  onSortChange,
  onClearFilters,
  activeFilterCount,
  resultCount,
}: FilterSidebarProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string | null) => {
    // Convert "all" to null to clear the filter
    const filterValue = value === "all" ? null : value

    onFilterChange({
      ...filters,
      [key]: filterValue,
    })
  }

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ] as const

  return (
    <Sidebar className="border-r border-zinc-200 dark:border-zinc-800">
      <SidebarHeader className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h2 className="font-semibold">Filters</h2>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <SidebarTrigger className="h-6 w-6" />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <span>{resultCount} items found</span>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-6 px-2 text-xs">
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">Gender</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select value={filters.gender || ""} onValueChange={(value) => handleFilterChange("gender", value || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                {genderOptions.map((gender) => (
                  <SelectItem key={gender.value} value={gender.value}>
                    {gender.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">Category</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select
              value={filters.category || ""}
              onValueChange={(value) => handleFilterChange("category", value || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <span className="capitalize">{category}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Size Filter - Third */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">Size</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select value={filters.size || ""} onValueChange={(value) => handleFilterChange("size", value || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Sizes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {sizeOptions.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Color Filter - Fourth */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">Color</SidebarGroupLabel>
          <SidebarGroupContent>
            <Select value={filters.color || ""} onValueChange={(value) => handleFilterChange("color", value || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Colors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    <span className="capitalize">{color}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 mb-3">
            <ArrowUpDown className="h-4 w-4" />
            Sort By
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Select value={sortOption} onValueChange={onSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
