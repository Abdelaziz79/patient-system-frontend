"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ClockIcon } from "lucide-react";

type Props = {
  time: Date | undefined;
  setTime: (time: Date | undefined) => void;
};

function TimePicker({ time, setTime }: Props) {
  const [hours, setHours] = useState<number>(time ? time.getHours() : 12);
  const [minutes, setMinutes] = useState<number>(time ? time.getMinutes() : 0);
  const [period, setPeriod] = useState<"AM" | "PM">(
    time ? (time.getHours() >= 12 ? "PM" : "AM") : "AM"
  );

  useEffect(() => {
    if (hours !== undefined && minutes !== undefined) {
      const newTime = new Date();
      newTime.setHours(period === "PM" ? (hours % 12) + 12 : hours % 12);
      newTime.setMinutes(minutes);
      newTime.setSeconds(0);
      setTime(newTime);
    }
  }, [hours, minutes, period, setTime]);

  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="reminderTime"
          variant="outline"
          className={cn(
            "w-44 justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <ClockIcon className="mr-2 h-4 w-4" />
          {time ? format(time, "h:mm a") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Hour</label>
              <select
                className="p-2 border rounded-md"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Minute</label>
              <select
                className="p-2 border rounded-md"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">AM/PM</label>
              <select
                className="p-2 border rounded-md"
                value={period}
                onChange={(e) => setPeriod(e.target.value as "AM" | "PM")}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date();
                setHours(now.getHours() % 12 || 12);
                setMinutes(now.getMinutes());
                setPeriod(now.getHours() >= 12 ? "PM" : "AM");
              }}
            >
              Now
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const selectedTime = new Date();
                selectedTime.setHours(
                  period === "PM" ? (hours % 12) + 12 : hours % 12
                );
                selectedTime.setMinutes(minutes);
                selectedTime.setSeconds(0);
                setTime(selectedTime);
              }}
            >
              Select
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TimePicker;
