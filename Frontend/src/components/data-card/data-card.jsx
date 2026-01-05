import { DataTable } from "./table-card"


const DataCard = ({
  description ="Deployment Bifurcation of Selected Tab",
  tab,
  columns,
  data,
  onRowClick,
  selectedRowId =""
}) => {
  return (
    <div className="flex-1 min-w-0 flex flex-col border rounded-2xl gap-2 p-3 h-auto lg:min-h-150">
        <div className="flex flex-col justify-start items-start">
            <h2 className="font-semibold">{tab}</h2>
            <span className="text-[.75rem] text-gray-500">{description}</span>
        </div>
        <DataTable columns={columns} data={data} onRowClick={onRowClick} selectedRowId={selectedRowId}/>
    </div>
  )
}

export default DataCard