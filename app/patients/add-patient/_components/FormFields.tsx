import { CustomCalendar } from "@/app/_components/CustomCalendar";
import { Field } from "@/app/_types/Template";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control } from "react-hook-form";

interface FormFieldsProps {
  field: Field;
  control: Control<any>;
}

export const FormFields = ({ field, control }: FormFieldsProps) => {
  switch (field.type) {
    case "text":
    case "email":
    case "phone":
      return (
        <FormField
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="mb-5 group">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={field.label}
                  type={
                    field.type === "email"
                      ? "email"
                      : field.type === "phone"
                      ? "tel"
                      : "text"
                  }
                  {...formField}
                  value={formField.value || ""}
                  required={field.required}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50 dark:bg-slate-900/50 dark:border-slate-700 dark:placeholder:text-slate-500"
                />
              </FormControl>
              {field.description && (
                <FormDescription className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  {field.description}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "number":
      return (
        <FormField
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="mb-5 group">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={field.label}
                  type="number"
                  {...formField}
                  value={formField.value || ""}
                  required={field.required}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50 dark:bg-slate-900/50 dark:border-slate-700 dark:placeholder:text-slate-500"
                />
              </FormControl>
              {field.description && (
                <FormDescription className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  {field.description}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "date":
      return (
        <FormField
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="flex flex-col mb-5 group">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal transition-all duration-200 border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-600 dark:text-slate-200",
                        !formField.value &&
                          "text-muted-foreground dark:text-slate-500"
                      )}
                    >
                      {formField.value ? (
                        format(new Date(formField.value), "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-slate-200 dark:border-slate-700 dark:bg-slate-900"
                  align="start"
                >
                  <CustomCalendar
                    selected={
                      formField.value ? new Date(formField.value) : undefined
                    }
                    onSelect={formField.onChange}
                  />
                </PopoverContent>
              </Popover>
              {field.description && (
                <FormDescription className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  {field.description}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "boolean":
      return (
        <FormField
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-5 group hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 dark:border-slate-700 dark:bg-slate-900/30">
              <FormControl>
                <Checkbox
                  checked={formField.value || false}
                  onCheckedChange={(checked) => {
                    // When the checkbox is clicked, always set a boolean value (true or false)
                    // This ensures that undefined is never the value for required boolean fields
                    formField.onChange(checked === true);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:border-slate-600"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </FormLabel>
                {field.description && (
                  <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                    {field.description}
                  </FormDescription>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "select":
      return (
        <FormField
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="mb-5 group">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <Select
                onValueChange={formField.onChange}
                defaultValue={formField.value}
                value={formField.value || ""}
              >
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50">
                    <SelectValue
                      placeholder={`Select ${field.label}`}
                      className="dark:placeholder:text-slate-500"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-80 border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                  {field.options?.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="focus:bg-blue-50 dark:focus:bg-blue-900/30 dark:text-slate-200"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.description && (
                <FormDescription className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  {field.description}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "textarea":
      return (
        <FormField
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className="mb-5 group">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={field.label}
                  {...formField}
                  value={formField.value || ""}
                  required={field.required}
                  className="min-h-24 transition-all duration-200 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50 border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:placeholder:text-slate-500 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-600"
                />
              </FormControl>
              {field.description && (
                <FormDescription className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  {field.description}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
};
