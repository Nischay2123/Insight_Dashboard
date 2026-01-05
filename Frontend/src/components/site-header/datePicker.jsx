import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedDate } from "@/redux/reducers/date"

export const formatDate = (date) => {
  if (!date) return null

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}


export const parseDate = (dateString) => {
  if (!dateString) return undefined
  return new Date(dateString)
}


export default function DatePicker() {
  const dispatch = useDispatch()
  const storedDate = useSelector(
    (state) => state.date.selectedDate
  )


  const [open, setOpen] = React.useState(false)

  const selectedDate =
    parseDate(storedDate) ?? new Date("2025-12-29")

  const handleSelect = (date) => {
    if (!date) return

    dispatch(setSelectedDate(formatDate(date)))
    setOpen(false) 
  }

  return (
    <div className="w-full lg:w-auto flex flex-col lg:flex-row items-start lg:items-center gap-3 pb-2 px-4 lg:px-6">
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            className="w-50 justify-start text-left font-normal"
            >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(selectedDate)}
            </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
            <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            />
        </PopoverContent>
        </Popover>
    </div>
  )
}
