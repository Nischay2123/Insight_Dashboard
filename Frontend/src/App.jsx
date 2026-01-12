import { Route, Routes } from "react-router-dom"
import { AppSidebar } from "./components/side-bar/app-sidebar"
import { SidebarProvider } from "./components/ui/sidebar"
import { lazy, Suspense } from "react";
import Deployemnts from "./pages/deployements";
// import Tab from "./pages/tab"
// import Payment from "./pages/payment"
// import Item from "./pages/item"
// import DeploymentAnalytics from "./pages/deploymentAnalytics"
const DeploymentAnalytics = lazy(() =>
  import("./pages/deploymentAnalytics")
);
const Tab = lazy(() => import("./pages/tab"));
const Item = lazy(() => import("./pages/item"));
const Payment = lazy(() => import("./pages/payment"));





function App() {

  return (
      <SidebarProvider>
        <AppSidebar/>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<DeploymentAnalytics />} />
            <Route path="/tabs" element={<Tab />} />
            <Route path="/menu" element={<Item />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/deployment_setting" element={<Deployemnts />} />
          </Routes>
        </Suspense>
      </SidebarProvider>
  )
}

export default App
