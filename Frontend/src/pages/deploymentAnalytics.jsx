import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"

import AnalyticsData from "@/components/analytics-card/data-analytics"
import TabSalesBarChart from "@/components/charts/bar-chart"
import DataCard from "@/components/data-card/data-card"
import SiteHeader from "@/components/site-header/site-header"
import { SectionCards } from "@/components/SiteCards/section-cards"
import { SidebarInset } from "@/components/ui/sidebar"

import { useGetDeploymentWisedataQuery } from "@/redux/api/deploymentIdApi"
import { ChartRadialStacked } from "@/components/charts/chart-radial-stack"
import { buildPreviousWeekMap, getPreviousWeekDate, sheetColumns } from "@/utils/deployments"

const DeploymentAnalytics = () => {
  const selectedDate = useSelector(
    (state) => state.date?.selectedDate
  )

  const effectiveDate =
    selectedDate ?? "2025-12-29"
  const previousWeekDate = getPreviousWeekDate(effectiveDate)

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

  const {
    data: previousWeekData,
    isLoading: isPreviousLoading,
    isError: isPreviousError,
  } = useGetDeploymentWisedataQuery(
    { date: previousWeekDate },
    { skip: !previousWeekDate }
  )
  const deployments = deploymentData?.data ?? []
  const PrevMap = useMemo(()=> buildPreviousWeekMap(previousWeekData?.data),[previousWeekData?.data])

  const [selectedDeployment, setSelectedDeployment] = useState(null)
  const [selectedPrevDeployment, setSelectedPrevDeployment] = useState(null)

useEffect(() => {
  if (!deployments.length) return

  setSelectedDeployment((prev) => {
    const deployment = prev ?? deployments[0]

    setSelectedPrevDeployment(
      PrevMap.get(deployment.deployment_id) ?? null
    )

    return deployment
  })
}, [deployments, PrevMap])


  
  return (
    <SidebarInset>
      <SiteHeader isDatePicker={true} headerTitle={"Dashboard Overview Per Deployment"} />

      <div className="@container/main flex flex-col gap-4 pb-4">
        <SectionCards
          deploymentData={selectedDeployment}
          prevData={selectedPrevDeployment}
        />

        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <ChartRadialStacked
            title="Orders by Tabs"
            descriptionText="Showing total per tab for the selected date"
            tabDetails={selectedDeployment?.tabDetails ?? []}
          />
          <AnalyticsData
            prevData={selectedPrevDeployment}
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
            onRowClick={(row) => {
              setSelectedDeployment(row)
              setSelectedPrevDeployment(PrevMap.get(row.deployment_id))
            }}
          />
        </div>
      </div>
    </SidebarInset>
  )
}

export default DeploymentAnalytics
