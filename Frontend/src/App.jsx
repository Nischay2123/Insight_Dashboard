import { Route, Routes } from "react-router-dom"
import { AppSidebar } from "./components/side-bar/app-sidebar"
import { SidebarProvider } from "./components/ui/sidebar"
import Tab from "./pages/tab"
import Payment from "./pages/payment"
import Item from "./pages/item"
import DeploymentAnalytics from "./pages/deploymentAnalytics"





function App() {

  return (
      <SidebarProvider>
        <AppSidebar/>
        <Routes>
        <Route path="/" element={<DeploymentAnalytics />} />
        <Route path="/tabs" element={<Tab />} />
        <Route path="/menu" element={<Item />} />
        <Route path="/payment" element={<Payment />} />
        </Routes>
      </SidebarProvider>
  )
}

export default App
