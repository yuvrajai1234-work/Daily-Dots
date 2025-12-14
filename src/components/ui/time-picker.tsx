
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [hour, minute] = value ? value.split(":") : ["", ""];

  const handleHourChange = (newHour: string) => {
    onChange(`${newHour}:${minute || "00"}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    onChange(`${hour || "00"}:${newMinute}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select onValueChange={handleHourChange} value={hour}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 24 }, (_, i) => {
            const h = i.toString().padStart(2, "0");
            return <SelectItem key={h} value={h}>{h}</SelectItem>;
          })}
        </SelectContent>
      </Select>
      <span>:</span>
      <Select onValueChange={handleMinuteChange} value={minute}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 60 }, (_, i) => {
            const m = i.toString().padStart(2, "0");
            return <SelectItem key={m} value={m}>{m}</SelectItem>;
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export { TimePicker };
