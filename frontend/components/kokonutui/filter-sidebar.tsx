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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { FilterOptions, SortOption } from "@/components/filter-sort-bar"

interface FilterSidebarProps {
  categories: string[]
  genders: string[]
  sizes: string[]
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
  filters,
  sortOption,
  onFilterChange,
  onSortChange,
  onClearFilters,
  activeFilterCount,
  resultCount,
}: FilterSidebarProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string | null) => {
    onFilterChange({
      ...filters,
      [key]: value,
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
        {/* Sort Section */}
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

        <SidebarSeparator className="my-4" />

        {/* Category Filter */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">Category</SidebarGroupLabel>
          <SidebarGroupContent>
            <RadioGroup
              value={filters.category || ""}
              onValueChange={(value) => handleFilterChange("category", value || null)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="category-all" />
                <Label htmlFor="category-all" className="text-sm font-normal">
                  All Categories
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem value={category} id={`category-${category}`} />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal capitalize">
                    {category}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Gender Filter */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">Gender</SidebarGroupLabel>
          <SidebarGroupContent>
            <RadioGroup
              value={filters.gender || ""}
              onValueChange={(value) => handleFilterChange("gender", value || null)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="gender-all" />
                <Label htmlFor="gender-all" className="text-sm font-normal">
                  All Genders
                </Label>
              </div>
              {genders.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender} id={`gender-${gender}`} />
                  <Label htmlFor={`gender-${gender}`} className="text-sm font-normal capitalize">
                    {gender}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Size Filter */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">Size</SidebarGroupLabel>
          <SidebarGroupContent>
            <RadioGroup value={filters.size || ""} onValueChange={(value) => handleFilterChange("size", value || null)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="size-all" />
                <Label htmlFor="size-all" className="text-sm font-normal">
                  All Sizes
                </Label>
              </div>
              {sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem value={size} id={`size-${size}`} />
                  <Label htmlFor={`size-${size}`} className="text-sm font-normal uppercase">
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
