import TabSalesBarChart from "@/components/charts/bar-chart"
import DataCard from "@/components/data-card/data-card"
import SiteHeader from "@/components/site-header/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useGetTabChartDataQuery ,useGetTabTableDataMutation} from "@/redux/api/tab"
import { useEffect, useState } from "react"

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

  
  const [tableData, setTableData] = useState([]);
  const [tab,setTab] = useState("");



  const { data, isLoading, isError, error } = useGetTabChartDataQuery();
  
  const [triggerGetTabTable] = useGetTabTableDataMutation();
  


  const handleBarData = async (item) => {
    const res = await triggerGetTabTable({ tab: item.tab });
    console.log(res);
    setTab(item.tab)
    setTableData(res.data.data ?? []);
  };

  useEffect(() => {
    if (!data?.data?.length) return;    
    if (tab) return;                       

    const first = data.data[0];

    (async () => {
      const res = await triggerGetTabTable({ tab: first.tab });
      setTab(first.tab);
      setTableData(res.data?.data ?? []);
    })();
  }, [data]);


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.data?.message || "Something went wrong"}</div>;

  return (
    <SidebarInset>
      <SiteHeader isDateFilter={true} />
      <div className="@container/main flex flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <TabSalesBarChart
            data={data?.data ?? []}
            xKey="tab"
            yKey="totalAmount"
            onBarClick={(item)=>handleBarData(item)}
            
          />

        <DataCard tab={tab} data={tableData} columns={columns} />
        </div>
      </div>
    </SidebarInset>
  );
};


export default Tab