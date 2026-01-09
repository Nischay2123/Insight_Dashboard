import TabSalesBarChart from '@/components/charts/bar-chart'
import DataCard from '@/components/data-card/data-card'
import SiteHeader from '@/components/site-header/site-header'
import { SidebarInset } from '@/components/ui/sidebar'
import React, { useEffect, useState } from 'react'

import {useGetPaymentChartDataQuery} from "@/redux/api/paymentApi"
import { useSelector } from 'react-redux'

const columns = [
  {
    accessorKey: "_id",
    header: "Deployment Id",
  },
  {
    accessorKey: "totalOrders",
    header: "Total Orders",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
  },
]

const Payment = () => {
  const selectedDate = useSelector(
    (state) => state.date?.selectedDate
  )

  const effectiveDate =
    selectedDate ?? "2025-12-29"

  const [tab, setTab] = useState("")
  // const [tableData, setTableData] = useState([])

  const {
    data: chartData,
    isLoading,
    isError,
    error,
  } = useGetPaymentChartDataQuery(
    { date: effectiveDate },
    {
      skip: !effectiveDate,
      refetchOnMountOrArgChange: true,
    }
  )

    useEffect(() => {
      if (!chartData?.data?.length) return
  
      const firstTab = chartData.data[chartData.data.length];
      (async () => {
        setTab(firstTab._id)
      })()
    }, [chartData, effectiveDate])
  return (
    <SidebarInset>
      <SiteHeader isDatePicker={true} headerTitle={"Dashboard Overview Per Payment Mode"}/>

      <div className="@container/main flex flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <TabSalesBarChart
            data={chartData?.data ?? []}
            xKey="_id"
            yKey="totalAmount"
            onBarClick={(row)=>setTab(row._id)}
          />

          <DataCard
            description='Deployment Bifurcation of Selected Payment mode'
            tab={tab}
            data={ []}
            columns={columns}
          />
        </div>
      </div>
    </SidebarInset>
  )
}

export default Payment