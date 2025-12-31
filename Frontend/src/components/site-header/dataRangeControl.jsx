import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { differenceInDays } from "date-fns"
import ToggleSideBar from "./toggleSidebar"
import React from "react"

const DateRangeControls = ({
  range,
  setRange,
  dateRange,
  isDesktop,
  desktopCalendarOpen,
  setDesktopCalendarOpen,
  showMobileCalendar,
  setShowMobileCalendar,
  handleCustomSelect,
  applyPresetRange
}) => {
  return (
    <div className="w-full lg:w-auto flex flex-col lg:flex-row items-start lg:items-center gap-3 pb-2 px-4 lg:px-6">

        <ToggleSideBar
            applyPresetRange={applyPresetRange}
            dateRange={dateRange}
            desktopCalendarOpen={desktopCalendarOpen}
            handleCustomSelect={handleCustomSelect}
            isDesktop={isDesktop}
            range={range}
            setDesktopCalendarOpen={setDesktopCalendarOpen}
            setRange={setRange}       
        />

        <Select
          value={range}
          onValueChange={(v) => {
            if (v === "custom") {
              setRange("custom")
              setShowMobileCalendar(true)
              return
            }
            applyPresetRange(v)
          }}
        >
          <SelectTrigger className="w-44 lg:hidden">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>

            <SelectItem
              value="custom"
              onClick={() => setShowMobileCalendar(true)}
            >
              Custom
            </SelectItem>
          </SelectContent>
        </Select>

        <Sheet open={showMobileCalendar} onOpenChange={setShowMobileCalendar}>
          <SheetContent side="bottom" className="p-4">
            <SheetHeader>
              <SheetTitle>Select Custom Date Range</SheetTitle>
            </SheetHeader>

            <div className="flex justify-center py-2">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleCustomSelect}
                numberOfMonths={1}
                disabled={(date) =>
                  dateRange?.from &&
                  differenceInDays(date, dateRange.from) > 15
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
  )
}

export default React.memo(DateRangeControls)
