import TabSalesBarChart from '@/components/charts/bar-chart'
import DataCard from '@/components/data-card/data-card'
import SiteHeader from '@/components/site-header/site-header'
import { SidebarInset } from '@/components/ui/sidebar'
import React, { useEffect, useState } from 'react'

import {useGetPaymentChartDataQuery, useGetPaymentTableDataMutation} from "@/redux/api/paymentApi"
import { useSelector } from 'react-redux'
import { SkeletonCard } from '@/components/loading'

const columns = [
  {
    accessorKey: "_id",
    header: "Tab",
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
  const [tableData, setTableData] = useState([])

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

    const [triggerGetPaymentTable] =
      useGetPaymentTableDataMutation()

    useEffect(() => {
      if (!chartData?.data?.length) return
  
      const firstTab = chartData.data[chartData.data.length-1];
      console.log(chartData);
      
      (async () => {
        setTab(firstTab._id)
        const res = await triggerGetPaymentTable({
        paymentMode: firstTab._id,date:effectiveDate
      })
      setTableData(res.data?.data ?? [])
      })()
    }, [chartData, effectiveDate])

  const handleBarData = async (item) => {
    setTab(item._id)
    const res = await triggerGetPaymentTable({
      paymentMode: item._id,date:effectiveDate
    })
    setTableData(res.data?.data ?? [])
  }


  if (isLoading) return <SkeletonCard/>

  if (isError){
    return (
      <div>
        Error: {error?.data?.message || "Something went wrong"}
      </div>
    )
  } 
  return (
    <SidebarInset>
      <SiteHeader isDatePicker={true} headerTitle={"Dashboard Overview Per Payment Mode"}/>

      <div className="@container/main flex flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <TabSalesBarChart
            data={chartData?.data ?? []}
            xKey="_id"
            yKey="totalAmount"
            onBarClick={handleBarData}
          />

          <DataCard
            description='Deployment Bifurcation of Selected Payment mode'
            tab={tab}
            data={tableData ?? []}
            columns={columns}
          />
        </div>
      </div>
    </SidebarInset>
  )
}

export default Payment