import AnalyticsData from '@/components/analytics-card/data-analytics'
import TabSalesBarChart from '@/components/charts/bar-chart'
import DataCard from '@/components/data-card/data-card'
import SiteHeader from '@/components/site-header/site-header'
import { SectionCards } from '@/components/SiteCards/section-cards'
import { SidebarInset } from '@/components/ui/sidebar'
import React from 'react'

const sheetColumns = [
  { accessorKey: "_id", header: "Deployment Id" },
  { accessorKey: "totalQuantity", header: "Quantity" },
  { accessorKey: "grossSale", header: "Total Sales" },
];
const DeploymentAnalytics = () => {
  return (
    <SidebarInset>
      <SiteHeader isDeployment={true} />
      <div className="@container/main flex flex-col gap-4 pb-4">
        <SectionCards/>
        
      <div className="flex flex-col gap-4  px-4 lg:px-6 ">
        <AnalyticsData />
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
            <TabSalesBarChart
              title="Top Performing Items"
              description="Top 20 performing items"
              data={[]}
              xKey="name"
              yKey="totalSubtotal"
              onBarClick={()=>{}}
            />

            <DataCard
              description="Includes total sale, quantity and rate"
              tab="Items"
              data={[]}
              columns={sheetColumns}
            />
          </div>
      </div>
    </SidebarInset>
  )
}

export default DeploymentAnalytics