"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { CustomCalendar } from "./CustomCalendar";

interface DatePickerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export default function DatePicker({
  date,
  setDate,
  className,
  ...props
}: DatePickerProps) {
  // Use memoized date to prevent unnecessary re-renders
  const formattedDate = React.useMemo(() => {
    return date ? format(date, "PPP") : "Pick a date";
  }, [date]);

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <CustomCalendar selected={date} onSelect={handleDateSelect} />
      </PopoverContent>
    </Popover>
  );
}
