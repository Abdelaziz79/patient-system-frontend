"use client";

import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // Assuming you have this from shadcn

interface Option {
  value: string;
  label: string;
}

interface ComboboxCreatableProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyStateMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function ComboboxCreatable({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search or create...",
  emptyStateMessage = "No option found.",
  className,
  disabled = false,
}: ComboboxCreatableProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const currentOption = options.find(
    (option) => option.value.toLowerCase() === value?.toLowerCase()
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setInputValue("");
  };

  const handleCreate = () => {
    if (
      inputValue.trim() !== "" &&
      !options.some(
        (opt) => opt.value.toLowerCase() === inputValue.trim().toLowerCase()
      )
    ) {
      onChange(inputValue.trim()); // Use the input value as the new category
      setOpen(false);
      setInputValue("");
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            className,
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {currentOption ? currentOption.label : value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          {" "}
          {/* We handle filtering manually */}
          <CommandInput
            placeholder={searchPlaceholder}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {inputValue.trim() !== "" ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleCreate}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Create
                  {inputValue.trim()}
                </Button>
              ) : (
                emptyStateMessage
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toLowerCase() === option.value.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {inputValue.trim() !== "" &&
              !filteredOptions.some(
                (opt) =>
                  opt.value.toLowerCase() === inputValue.trim().toLowerCase()
              ) && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleCreate}
                      className="cursor-pointer"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Create
                      {inputValue.trim()}
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
