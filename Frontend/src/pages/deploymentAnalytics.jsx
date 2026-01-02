import AnaylyticsTable from '@/components/analytics-card/table-analytics'
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
        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
        <div className='border rounded-2xl w-full'>
          <AnaylyticsTable />
        </div>
        </div>
      </div>
    </SidebarInset>
  )
}

export default DeploymentAnalytics