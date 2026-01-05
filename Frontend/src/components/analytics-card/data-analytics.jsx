import React from 'react'
import { Separator } from '../ui/separator'
import { AnalyticsTable } from './table-analytics'
import { useMediaQuery } from '@/customHooks/desktop'
const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "today",
    header: "Today",
  },
  // {
  //   accessorKey: "change",
  //   header: "Change",
  //   cell: ({ row }) => (
  //     <span
  //       className={
  //         row.original.change >= 0
  //           ? "text-green-600"
  //           : "text-red-500"
  //       }
  //     >
  //       {row.original.change} %
  //     </span>
  //   ),
  // },
]

function deploymentToMetrics(deployment) {
  if (!deployment || typeof deployment !== "object") return []

  return [
    { name: "Customers Served", today: deployment.totalCustomerServed },
    { name: "Discount", today: deployment.totalDiscount },
    { name: "Covers", today: deployment.totalCovers },
    { name: "Void Bills", today: deployment.voidBills },
    { name: "Kot Deleted", today: deployment.deletedKot },
    { name: "Avg Per Bill", today: deployment.averagePerBill },
    { name: "Avg Per Cover", today: deployment.averagePerCover },
    { name: "ARPU", today: deployment.averageRevenuePerUser },
    { name: "Covers (Dine In)", today: deployment.averageRevenuePerUser },
    { name: "Net Sales (Dine in)", today: deployment.averageRevenuePerUser },
    { name: "Avg Per Cover (Dine in)", today: deployment.averageRevenuePerUser },
  ]
}

function transformMetrics(data) {

  const safeData = Array.isArray(data) ? data : []

  const uniqueMap = new Map()

  safeData.forEach(item => {
    if (!uniqueMap.has(item.name)) {
      uniqueMap.set(item.name, item)
    }
  })

  const uniqueArray = Array.from(uniqueMap.values())
  const mid = Math.ceil(uniqueArray.length / 2)

  return {
    left: uniqueArray.slice(0, mid),
    right: uniqueArray.slice(mid),
  }
}



const AnalyticsData = ({data={}}) => {
  const metricsArray = deploymentToMetrics(data)
  const result = transformMetrics(metricsArray)
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  
  
  return (
    <div className="flex flex-col p-6 border rounded-2xl gap-6">
      <div className='flex flex-col justify-start'>
        <div className='text-xl px-3'>Other Metrics</div>
        <span className=' text-sm text-gray-500 px-3'>Track key metrics in real time</span>
      </div>
      {
        isDesktop ?
        <div className='w-full flex flex-row gap-2'>
          <AnalyticsTable data={result.left} columns={columns}  />
          <Separator orientation='vertical'/>
          <AnalyticsTable data={result.right} columns={columns}  />
        </div>:
        <div className='w-full flex flex-row gap-2'>
          <AnalyticsTable data={metricsArray} columns={columns}  />
        </div>
      }

      
    </div>
  )
}

export default AnalyticsData