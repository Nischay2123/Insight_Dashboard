import React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Calendar } from '../ui/calendar'

const ToggleSideBar = ({
    range,
    applyPresetRange,
    setRange,
    setDesktopCalendarOpen,
    desktopCalendarOpen,
    isDesktop,
    dateRange,
    handleCustomSelect
}) => {
  return (
    <ToggleGroup
          type="single"
          value={range}
          onValueChange={(v) => {
            if (!v) return
            if (v === "custom") {
              setDesktopCalendarOpen(true)
              setRange("custom")
              return
            }
            applyPresetRange(v)
          }}
          variant="outline"
          className="hidden lg:flex *:data-[slot=toggle-group-item]:px-4"
        >
          <div className="flex justify-around items-center">
            <ToggleGroupItem
              value="today"
              className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
            >
              Today
            </ToggleGroupItem>

            <ToggleGroupItem
              value="yesterday"
              className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
            >
              Yesterday
            </ToggleGroupItem>

            <ToggleGroupItem
              value="7d"
              className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
            >
              Last 7 days
            </ToggleGroupItem>

            {isDesktop && (
              <Popover
                open={desktopCalendarOpen}
                onOpenChange={setDesktopCalendarOpen}
              >
                <PopoverTrigger asChild>
                  <ToggleGroupItem
                    value="custom"
                    className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                  </ToggleGroupItem>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={handleCustomSelect}
                    numberOfMonths={2}
                    disabled={(date) =>
                      dateRange?.from &&
                      differenceInDays(date, dateRange.from) > 15
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </ToggleGroup>
  )
}

export default React.memo(ToggleSideBar)