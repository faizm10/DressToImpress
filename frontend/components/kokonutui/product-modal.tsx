"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import type { AttireWithUrl } from "@/hooks/use-attires";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { addDays, parseISO, format } from "date-fns";
import {
  CustomCalendar,
  type DateRange,
} from "@/components/ui/custom-calendar";

interface AttireModelProps {
  attire: AttireWithUrl;
  onClose: () => void;
  onAddToCart: (attire: AttireWithUrl, dateRange?: DateRange) => void;
}

export function AttireModel({
  attire,
  onClose,
  onAddToCart,
}: AttireModelProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();

  // Fetch unavailable dates for this attire
  useEffect(() => {
    async function fetchUnavailableDates() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("attire_requests")
        .select("use_start_date, use_end_date")
        .eq("attire_id", attire.id);

      if (error) {
        console.error("Error fetching unavailable dates:", error);
        setIsLoading(false);
        return;
      }

      // Process the data to get all dates between start and end dates
      const allUnavailableDates: Date[] = [];

      data.forEach((booking) => {
        if (booking.use_start_date && booking.use_end_date) {
          const startDate = parseISO(booking.use_start_date);
          const endDate = parseISO(booking.use_end_date);

          // Generate all dates between start and end
          let currentDate = startDate;
          while (currentDate <= endDate) {
            allUnavailableDates.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
          }
        }
      });

      setUnavailableDates(allUnavailableDates);
      setIsLoading(false);
    }

    fetchUnavailableDates();
  }, [attire.id, supabase]);

  // Function to disable unavailable dates in the calendar
  const disabledDays = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Check if the date is in the unavailable dates array
    return unavailableDates.some(
      (unavailableDate) =>
        unavailableDate.getDate() === date.getDate() &&
        unavailableDate.getMonth() === date.getMonth() &&
        unavailableDate.getFullYear() === date.getFullYear()
    );
  };

  const handleAddToCart = () => {
    onAddToCart(attire, dateRange);
  };

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
        className="fixed inset-x-2 bottom-0 md:inset-x-[15vw] md:inset-y-[8vh] z-50 bg-white dark:bg-zinc-900 rounded-t-xl md:rounded-xl overflow-hidden max-h-[92vh] md:max-h-[84vh] overflow-y-auto shadow-2xl"
      >
        <div className="h-full md:flex">
          <div className="relative md:w-1/2 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <img
              src={attire.imageUrl ?? "/placeholder.png"}
              alt={attire.name}
              className="w-full max-h-[60vh] md:max-h-[70vh] object-contain rounded-lg shadow-md"
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 md:w-1/2 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-sm font-medium">{attire.name}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {attire.category}
                  </p>
                </div>
                <p className="text-sm font-medium">{attire.gender}</p>
              </div>
              <div className="space-y-2 mb-3">
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  {attire.size}
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-5 w-5 border-2 border-zinc-500 rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium mb-2">Select dates:</h3>
                  <p className="text-[11px] text-zinc-500 mb-2">
                    Select a start date, then an end date to choose your rental period.
                    <br />
                    For same day rental, click the same date twice.
                  </p>
                  <CustomCalendar
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={disabledDays}
                    className="border rounded-md"
                  />

                  {dateRange?.from && (
                    <div className="mt-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-md">
                      <p className="text-xs">
                        Selected: {format(dateRange.from, "MMM d, yyyy")}
                        {dateRange.to
                          ? ` to ${format(dateRange.to, "MMM d, yyyy")}`
                          : ""}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!dateRange?.from || !dateRange?.to}
              className={`
                w-full mt-3 py-2 
                bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 
                text-xs font-medium rounded-md 
                transition-colors
                ${
                  !dateRange?.from || !dateRange?.to
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-zinc-800 dark:hover:bg-zinc-100"
                }
              `}
            >
              {!dateRange?.from || !dateRange?.to
                ? "Select dates to continue"
                : "Add to Cart"}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
