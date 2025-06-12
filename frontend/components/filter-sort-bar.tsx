"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type FilterOptions = {
  category: string | null;
  gender: string | null;
  size: string | null;
};

export type SortOption = "name-asc" | "name-desc" | "newest" | "oldest";

interface FilterSortBarProps {
  categories: string[];
  genders: string[];
  sizes: string[];
  filters: FilterOptions;
  sortOption: SortOption;
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
}

export function FilterSortBar({
  categories,
  genders,
  sizes,
  filters,
  sortOption,
  onFilterChange,
  onSortChange,
  onClearFilters,
}: FilterSortBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.gender ? 1 : 0) +
    (filters.size ? 1 : 0);

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <div className="grid gap-4 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Category</h4>
                  <Select
                    value={filters.category || "all-categories"}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        category: value === "all-categories" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">
                        All categories
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Gender</h4>
                  <Select
                    value={filters.gender || "all-genders"}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        gender: value === "all-genders" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-genders">All genders</SelectItem>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Size</h4>
                  <Select
                    value={filters.size || "all-sizes"}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        size: value === "all-sizes" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sizes">All sizes</SelectItem>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {filters.category}
                  <button
                    onClick={() =>
                      onFilterChange({ ...filters, category: null })
                    }
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 3L3 9M3 3L9 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Badge>
              )}
              {filters.gender && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Gender: {filters.gender}
                  <button
                    onClick={() => onFilterChange({ ...filters, gender: null })}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 3L3 9M3 3L9 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Badge>
              )}
              {filters.size && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Size: {filters.size}
                  <button
                    onClick={() => onFilterChange({ ...filters, size: null })}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 3L3 9M3 3L9 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={sortOption}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="w-[160px]">
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
        </div>
      </div>
    </div>
  );
}
