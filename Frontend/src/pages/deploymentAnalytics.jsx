import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import AnalyticsData from "@/components/analytics-card/data-analytics"
import TabSalesBarChart from "@/components/charts/bar-chart"
import DataCard from "@/components/data-card/data-card"
import SiteHeader from "@/components/site-header/site-header"
import { SectionCards } from "@/components/SiteCards/section-cards"
import { SidebarInset } from "@/components/ui/sidebar"

import { useGetDeploymentWisedataQuery } from "@/redux/api/deploymentIdApi"
import { ChartRadialStacked } from "@/components/charts/chart-radial-stack"

const sheetColumns = [
  { accessorKey: "deployment_id", header: "Deployment Id" },
  { accessorKey: "netSales", header: "Net Sales" },
  { accessorKey: "totalBills", header: "Total Orders" },
]



const DeploymentAnalytics = () => {
  const selectedDate = useSelector(
    (state) => state.date?.selectedDate
  )

  const effectiveDate =
    selectedDate ?? "2025-12-29"

  const {
    data: deploymentData,
    isLoading,
    isError,
  } = useGetDeploymentWisedataQuery(
    { date: effectiveDate },
    {
      skip: !effectiveDate,
    }
  )

  const deployments = deploymentData?.data ?? []

  const [selectedDeployment, setSelectedDeployment] = useState(null)

  useEffect(() => {
    if (deployments.length > 0) {
      setSelectedDeployment(deployments[0])
    } else {
      setSelectedDeployment(null)
    }
  }, [effectiveDate, deployments])


  
  return (
    <SidebarInset>
      <SiteHeader isDatePicker={true} />

      <div className="@container/main flex flex-col gap-4 pb-4">
        <SectionCards deploymentData={selectedDeployment} />

        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <ChartRadialStacked
            title="Orders by Tabs"
            descriptionText="Showing total per tab for the selected date"
            tabDetails={selectedDeployment?.tabDetails ?? []}
          />
          <AnalyticsData
            data={selectedDeployment}
            loading={isLoading}
            error={isError}
          />
        </div>

        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <TabSalesBarChart
            title="Top Deployments"
            description="Top performing deployments as per sales"
            data={deploymentData?.data ?? []}
            xKey="deployment_id"
            yKey="netSales"
            onBarClick={() => {}}
            loading={isLoading}
          />

          <DataCard
            description="Per deployment live sales and orders"
            tab="Deployments List"
            data={deploymentData?.data ?? []}
            columns={sheetColumns}
            loading={isLoading}
            selectedRowId={selectedDeployment?.deployment_id}
            onRowClick={(row) => setSelectedDeployment(row)}
          />
        </div>
      </div>
    </SidebarInset>
  )
}

export default DeploymentAnalytics
