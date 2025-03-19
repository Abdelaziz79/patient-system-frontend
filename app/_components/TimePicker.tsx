"use client";

import * as React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  time: Date | undefined;
  setTime: (time: Date | undefined) => void;
}

export default function TimePicker({ time, setTime }: TimePickerProps) {
  // Use useMemo to prevent unnecessary re-renders
  const timeString = React.useMemo(() => {
    if (time) {
      return format(time, "h:mm a");
    }
    return "Select time";
  }, [time]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputTime = e.target.value;
    if (inputTime) {
      const [hours, minutes] = inputTime.split(":").map(Number);
      const newDate = new Date();
      if (time) {
        newDate.setFullYear(
          time.getFullYear(),
          time.getMonth(),
          time.getDate()
        );
      }
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      newDate.setSeconds(0);
      setTime(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {timeString}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-2">
          <Input
            type="time"
            value={time ? format(time, "HH:mm") : ""}
            onChange={handleTimeChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
