"use client";

import { Button } from "@/components/ui/button";
import { Package, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EmailActionsProps {
  rentalData: {
    firstName: string;
    email: string;
    rentalStartDate: string;
    rentalEndDate: string;
    pickupDate: string;
  };
}

export function EmailActions({ rentalData }: EmailActionsProps) {
  const [isLoading, setIsLoading] = useState<"pickup" | "dropoff" | null>(null);

  // components/EmailActions.tsx
  const sendEmail = async (type: "pickup" | "dropoff") => {
    setIsLoading(type);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rentalData, type }),
      });
      const payload = await res.json();

      if (!res.ok) {
        // stringify so you actually see the shape
        const msg =
          typeof payload.error === "string"
            ? payload.error
            : JSON.stringify(payload.error, null, 2);
        throw new Error(msg);
      }

      toast("Email sent successfully");
    } catch (err: any) {
      console.error("Error sending email:", err.message);
      toast(`Error: ${err.message}`);
    } finally {
      setIsLoading(null);
    }
  };

  const handleSendPickupEmail = () => sendEmail("pickup");
  const handleSendDropoffEmail = () => sendEmail("dropoff");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Email Notifications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleSendPickupEmail}
          className="h-11"
          disabled={isLoading === "pickup"}
        >
          <Package className="mr-2 h-4 w-4" />
          {isLoading === "pickup" ? "Sending..." : "Send Pickup Email"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSendDropoffEmail}
          className="h-11"
          disabled={isLoading === "dropoff"}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isLoading === "dropoff" ? "Sending..." : "Send Dropoff Email"}
        </Button>
      </div>
    </div>
  );
}
