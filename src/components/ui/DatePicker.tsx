"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  field: { value: Date; onChange: (date: Date) => void };
  disabled?: boolean; // Add the disabled prop
}

export function DatePicker({ field, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[100%] justify-start text-left font-normal",
            !field.value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? (
            format(field.value, "dd/MM/yyyy")
          ) : (
            <span>Selecciona un día</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={field.value}
          onSelect={(date) => {
            if (date) field.onChange(date); // Actualiza solo si `date` es válido
          }}
          fromYear={1960}
          toYear={2030}
          disabled={disabled} // Optionally pass disabled to Calendar if needed
        />
      </PopoverContent>
    </Popover>
  );
}
