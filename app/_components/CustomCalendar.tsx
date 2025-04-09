"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CustomCalendar({
  selected,
  onSelect,
}: {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<
    Array<{ date: Date; currentMonth: boolean }>
  >([]);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);

  // Generate array of years from 1900 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    // If a date is selected, set the calendar to that month
    if (selected) {
      setCurrentMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
  }, [selected]);

  useEffect(() => {
    generateCalendarDays(currentMonth);
  }, [currentMonth]);

  const generateCalendarDays = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate days from previous month to show
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Calculate days from next month to show
    const totalDaysToShow = 42; // 6 rows of 7 days

    const days: Array<{ date: Date; currentMonth: boolean }> = [];

    // Previous month days
    const prevMonthDays = startingDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const prevMonthDaysCount = prevMonth.getDate();

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDaysCount - i),
        currentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }

    // Next month days
    const remainingDays = totalDaysToShow - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
      });
    }

    setCalendarDays(days);
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const changeYear = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setYearPickerOpen(false);
  };

  const changeMonth = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
  };

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const isSelected = (date: Date): boolean => {
    return selected ? formatDate(date) === formatDate(selected) : false;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          {/* Month selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-2 font-medium flex items-center gap-1"
              >
                {MONTHS[currentMonth.getMonth()]}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <div className="grid grid-cols-3 gap-1 p-2">
                {MONTHS.map((month, index) => (
                  <Button
                    key={month}
                    variant={
                      currentMonth.getMonth() === index ? "default" : "ghost"
                    }
                    size="sm"
                    className="text-xs"
                    onClick={() => changeMonth(index)}
                  >
                    {month.substring(0, 3)}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Year selector */}
          <Popover open={yearPickerOpen} onOpenChange={setYearPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-2 font-medium flex items-center gap-1"
              >
                {currentMonth.getFullYear()}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0 max-h-60 overflow-auto">
              <div className="grid grid-cols-4 gap-1 p-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={
                      currentMonth.getFullYear() === year ? "default" : "ghost"
                    }
                    size="sm"
                    className="text-xs"
                    onClick={() => changeYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((dayObj, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 font-normal rounded-full",
              !dayObj.currentMonth && "text-slate-400 dark:text-slate-500",
              isSelected(dayObj.date) &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              isToday(dayObj.date) &&
                !isSelected(dayObj.date) &&
                "border border-primary text-primary"
            )}
            onClick={() => onSelect(dayObj.date)}
          >
            {dayObj.date.getDate()}
          </Button>
        ))}
      </div>
    </div>
  );
}
