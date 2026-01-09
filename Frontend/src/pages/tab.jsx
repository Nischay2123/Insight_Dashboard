import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import TabSalesBarChart from "@/components/charts/bar-chart"
import DataCard from "@/components/data-card/data-card"
import SiteHeader from "@/components/site-header/site-header"
import { SidebarInset } from "@/components/ui/sidebar"

import {
  useGetTabChartDataQuery,
  useGetTabTableDataMutation,
} from "@/redux/api/tab"

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

const Tab = () => {
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
  } = useGetTabChartDataQuery(
    { date: effectiveDate },
    {
      skip: !effectiveDate,
      refetchOnMountOrArgChange: true,
    }
  )

  const [triggerGetTabTable] =
    useGetTabTableDataMutation()

  useEffect(() => {
    setTab("")
    setTableData([])
  }, [effectiveDate])

  useEffect(() => {
    if (!chartData?.data?.length) return

    const firstTab = chartData.data[0];
    (async () => {
      setTab(firstTab.tab)
      const res = await triggerGetTabTable({
        tab: firstTab.tab,date:effectiveDate
      })
      setTableData(res.data?.data ?? [])
    })()
  }, [chartData, effectiveDate, triggerGetTabTable])

  const handleBarData = async (item) => {
    setTab(item.tab)
    const res = await triggerGetTabTable({
      tab: item.tab,date:effectiveDate
    })
    setTableData(res.data?.data ?? [])
  }

  if (isLoading) return <div>Loading...</div>

  if (isError)
    return (
      <div>
        Error: {error?.data?.message || "Something went wrong"}
      </div>
    )

  return (
    <SidebarInset>
      <SiteHeader isDatePicker={true} headerTitle={"Dashboard Overview Per Tab"}/>

      <div className="@container/main flex flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <TabSalesBarChart
            data={chartData?.data ?? []}
            xKey="tab"
            yKey="totalAmount"
            onBarClick={handleBarData}
          />

          <DataCard
            tab={tab}
            data={tableData}
            columns={columns}
          />
        </div>
      </div>
    </SidebarInset>
  )
}

export default Tab
