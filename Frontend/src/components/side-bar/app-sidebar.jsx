import * as React from "react"
import {
  ChartArea,
  DollarSign,
  icons,
  MenuIcon,
  PieChart,
} from "lucide-react"

import { NavAnalytics } from "@/components/side-bar/nav-liveanalytics"
import { NavUser } from "@/components/side-bar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "RestroWorks",
    email: "restroworks@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  liveAnalytics: [
    {
      name: "Deployment Analysis",
      url: "/",
      icon: ChartArea,
    },
    {
      name: "Tabwise Analysis",
      url: "/tabs",
      icon: PieChart,
    },
    {
      name: "Menu Analysis",
      url: "/menu",
      icon: MenuIcon,
    },
    
  ],
}

export const  AppSidebar=React.memo(({ ...props })=> {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader  className="font-bold text-xl group-data-[state=collapsed]:hidden flex flex-row justify-between">
        Restroworks 
        <SidebarTrigger className="-ml-1" />
      </SidebarHeader>
      <div className="group-data-[state=expanded]:hidden flex justify-center py-2">
        <SidebarTrigger />
      </div>
      <SidebarContent>
        <NavAnalytics projects={data.liveAnalytics} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
})
