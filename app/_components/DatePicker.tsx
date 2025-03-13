"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { CustomCalendar, MONTHS } from "./CustomCalendar";
type Props = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

function DatePicker({ date, setDate }: Props) {
  const formatDisplayDate = (date: Date) => {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="reminderDate"
          variant="outline"
          className={cn(
            "w-44 justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDisplayDate(date) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <CustomCalendar selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
