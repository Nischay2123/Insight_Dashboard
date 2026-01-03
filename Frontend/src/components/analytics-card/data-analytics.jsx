import React from 'react'
import { Separator } from '../ui/separator'
import { AnalyticsTable } from './table-analytics'
const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "today",
    header: "Today",
  },
  {
    accessorKey: "change",
    header: "Change",
    cell: ({ row }) => (
      <span
        className={
          row.original.change >= 0
            ? "text-green-600"
            : "text-red-500"
        }
      >
        {row.original.change} %
      </span>
    ),
  },
]

const data = [
  { name: "Customers Served", today: 493, change: -64.35 },
  { name: "ARPU", today: 480, change: 10.02 },
  { name: "Customers Served", today: 493, change: -64.35 },
  { name: "ARPU", today: 480, change: 10.02 },
]

const AnalyticsData = () => {
  return (
    <div className="flex flex-col p-6 border rounded-2xl gap-6">
      <div className='flex flex-col justify-start'>
        <div className='text-xl px-3'>Other Metrics</div>
        <span className=' text-sm text-gray-500 px-3'>Track key metrics in real time</span>
      </div>
      <div className='w-full flex flex-row gap-2'>
        <AnalyticsTable data={data} columns={columns}  />
        <Separator orientation='vertical'/>
        <AnalyticsTable data={data} columns={columns}  />
      </div>
      
    </div>
  )
}

export default AnalyticsData