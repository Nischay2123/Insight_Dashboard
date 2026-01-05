import React, { useState } from "react"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import { useDispatch } from "react-redux"

import { addDays, differenceInDays } from "date-fns"
import { setDateRange } from "@/redux/reducers/data"
import { useMediaQuery } from "@/customHooks/desktop"
import DateRangeControls from './dataRangeControl';
import SelectSidebar from "./selectSidebar"
import DatePicker from "./datePicker"



const SiteHeader = ({
  isDateFilter=false,
  isDeployment=false,
  isDatePicker=false,
  options=[]
}) => {


  const [range, setRange] = useState("7d")
  const [dateRange, setDateRangeState] = useState()
  const [showMobileCalendar, setShowMobileCalendar] = useState(false)
  const [desktopCalendarOpen, setDesktopCalendarOpen] = useState(false)

  const dispatch = useDispatch()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const applyPresetRange = (value) => {
    const today = new Date()

    if (value === "today") {
      dispatch(
        setDateRange({
          from: today.toISOString(),
          to: today.toISOString(),
        })
      )
    }

    if (value === "yesterday") {
      const y = addDays(today, -1)
      dispatch(
        setDateRange({
          from: y.toISOString(),
          to: y.toISOString(),
        })
      )
    }

    if (value === "7d") {
      dispatch(
        setDateRange({
          from: addDays(today, -7).toISOString(),
          to: today.toISOString(),
        })
      )
    }

    setRange(value)
  }

  const handleCustomSelect = (r) => {
    if (r?.from && !r?.to) {
      setDateRangeState(r)
      return
    }

    if (r?.from && r?.to) {
      const diff = differenceInDays(r.to, r.from)

      if (diff > 15) {
        alert("Maximum allowed custom range is 15 days")
        return
      }

      setDateRangeState(r)

      dispatch(
        setDateRange({
          from: r.from.toISOString(),
          to: r.to.toISOString(),
        })
      )

      setRange("custom")
      setDesktopCalendarOpen(false)
      setShowMobileCalendar(false)
    }
  }

  return (
    <header className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-2 h-auto lg:h-25">
      <div className="flex items-center gap-2 px-4 lg:p-6">
        <SidebarTrigger className="-ml-1 sm:hidden" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 sm:hidden"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold leading-tight lg:text-2xl">
            Dashboard Overview
          </h1>
          <span className="hidden text-sm text-muted-foreground lg:block">
            Real-time aggregated analytics for all restaurant locations
          </span>
        </div>
      </div>

      {
        isDeployment && 
        <SelectSidebar 
          options={options}
        />
      }

      {
        isDateFilter &&
        <DateRangeControls 
        range={range}
        dateRange={dateRange}
        desktopCalendarOpen={desktopCalendarOpen}
        isDesktop={isDesktop}
        setDesktopCalendarOpen={setDesktopCalendarOpen}
        setRange={setRange}
        setShowMobileCalendar={setShowMobileCalendar}
        showMobileCalendar={showMobileCalendar}
        applyPresetRange={applyPresetRange}
        handleCustomSelect={handleCustomSelect}
      />
      }

      {
        isDatePicker && 
        < DatePicker />
      }

    </header>
  )
}

export default React.memo(SiteHeader)
