"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface CustomCalendarProps {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function CustomCalendar({
  selected,
  onSelect,
  disabled,
  className = "",
}: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Generate calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const isDisabled = disabled ? disabled(cloneDay) : false;
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selected?.from && isSameDay(day, selected.from);
      const isSelectedEnd = selected?.to && isSameDay(day, selected.to);
      const isInRange =
        selected?.from &&
        selected?.to &&
        day > selected.from &&
        day < selected.to;

      days.push(
        <div
          key={day.toString()}
          className={`
            w-10 h-10 mx-auto flex items-center justify-center text-base cursor-pointer relative
            ${!isCurrentMonth ? "text-zinc-300 dark:text-zinc-600" : ""}
            ${
              isDisabled
                ? "text-zinc-300 dark:text-zinc-600 line-through cursor-not-allowed"
                : ""
            }
            ${
              isSelected || isSelectedEnd
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full"
                : ""
            }
            ${isInRange ? "bg-zinc-100 dark:bg-zinc-800" : ""}
            ${
              !isDisabled && isCurrentMonth && !isSelected && !isSelectedEnd
                ? "hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                : ""
            }
          `}
          onClick={() => handleDateClick(cloneDay, isDisabled)}
        >
          {formattedDate}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }

  const handleDateClick = (day: Date, isDisabled: boolean) => {
    if (isDisabled) return;

    if (!selected?.from || (selected.from && selected.to)) {
      // Start new selection
      onSelect?.({ from: day, to: undefined });
    } else if (selected.from && !selected.to) {
      // Complete the range
      if (day < selected.from) {
        onSelect?.({ from: day, to: selected.from });
      } else {
        onSelect?.({ from: selected.from, to: day });
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <h2 className="text-xl font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center p-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">{rows}</div>
    </div>
  );
}
