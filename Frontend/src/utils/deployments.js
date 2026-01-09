export const sheetColumns = [
  { accessorKey: "deployment_id", header: "Deployment Id" },
  { accessorKey: "netSales", header: "Net Sales" },
  { accessorKey: "totalBills", header: "Total Orders" },
]

export const getPreviousWeekDate = (dateStr) => {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 7)
  return d.toISOString().split("T")[0]
}

export function buildPreviousWeekMap(previousWeekData = []) {
  const map = new Map()

  for (const deployment of previousWeekData) {
    if (!deployment?.deployment_id) continue

    map.set(deployment.deployment_id, deployment)
  }

  return map
}
