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
  {
    accessorKey: "change",
    header: "Change",
    cell: ({ row }) => {
      const change = row.original.change
      if (change == (null)) {
        return <span className="text-gray-400">—</span>
      }

      if (Number(change) === 0) {
        return <span className="text-gray-500">-</span>
      }
      return <span
        className={
          change >= 0
            ? "text-green-600"
            : "text-red-500"
        }
      >
        {row.original.change} %
      </span>
    },
  },
]


function calculateChange(today, previous) {
  if (previous === 0 || previous == null) return null
  return (((today - previous) / previous) * 100).toFixed(2)
}

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
    { name: "Covers (Dine In)", today: deployment.dineInCovers },
    { name: "Net Sales (Dine in)", today: deployment.dineInNetSales },
    { name: "Avg Per Cover (Dine in)", today: deployment.dineInAvgPerCover },
  ]
}
function deploymentToMetricsWithComparison(deployment, prevDeployment) {
  if (!deployment || typeof deployment !== "object") return []

  const prevMetrics = deploymentToMetrics(prevDeployment)

  const prevMap = new Map()
  prevMetrics.forEach(m => {
    prevMap.set(m.name, m.today)
  })

  return deploymentToMetrics(deployment).map(metric => {
    const prevValue = prevMap.get(metric.name)

    return {
      name: metric.name,
      today: metric.today,
      change: calculateChange(metric.today, prevValue),
    }
  })
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



const AnalyticsData = ({
  data={},
  prevData={}
}) => {
  
  const metricsArray = deploymentToMetricsWithComparison(data, prevData)
  const result = transformMetrics(metricsArray)
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  
  
  return (
    <div className="basis-[60%] flex flex-col p-3 border rounded-2xl gap-10">
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