"use client";

import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Pick up the official DayPickerProps so TS knows about the new "components" keys
type CalendarProps = DayPickerProps;

export function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // … your existing classNames here …
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        // … etc …
        ...classNames,
      }}
      components={{
        // preserve any other overrides
        ...components,

        // override the single Chevron slot instead of IconLeft/IconRight
        Chevron: ({ orientation, className: iconClass, ...rest }) => {
          return orientation === "left" ? (
            <ChevronLeft
              className={cn("size-4", iconClass)}
              {...rest}
            />
          ) : (
            <ChevronRight
              className={cn("size-4", iconClass)}
              {...rest}
            />
          );
        },
      }}
      {...props}
    />
  );
}
