import * as React from "react"
import {
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
      name: "Tabwise Analysis",
      url: "/",
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
      <SidebarTrigger className="group-data-[state=expanded]:hidden ml-2 mt-2 sm:block hidden " />
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
