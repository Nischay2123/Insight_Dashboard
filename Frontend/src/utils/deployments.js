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



export function aggregateByIds(ids, dataMap) {
  const aggregated = {
    grossSales: 0,
    netSales: 0,
    totalBills: 0,
    totalCovers: 0,
    totalDiscount: 0,
    voidBills: 0,
    deletedKot: 0,
    totalCustomerServed: 0,
    dineInNetSales: 0,
    dineInCovers: 0,
    tabDetails: {}, // intermediate map
  };

  for (const id of ids) {
    const doc = dataMap.get(id);
    if (!doc) continue;

    aggregated.grossSales += doc.grossSales || 0;
    aggregated.netSales += doc.netSales || 0;
    aggregated.totalBills += doc.totalBills || 0;
    aggregated.totalCovers += doc.totalCovers || 0;
    aggregated.totalDiscount += doc.totalDiscount || 0;
    aggregated.voidBills += doc.voidBills || 0;
    aggregated.deletedKot += doc.deletedKot || 0;
    aggregated.totalCustomerServed += doc.totalCustomerServed || 0;
    aggregated.dineInNetSales += doc.dineInNetSales || 0;
    aggregated.dineInCovers += doc.dineInCovers || 0;

    if (Array.isArray(doc.tabDetails)) {
      for (const { tab, totalOrdersOfTab } of doc.tabDetails) {
        aggregated.tabDetails[tab] =
          (aggregated.tabDetails[tab] || 0) + (totalOrdersOfTab || 0);
      }
    }
  }

  return {
    ...aggregated,
    averagePerBill:
      aggregated.totalBills > 0
        ? (aggregated.netSales / aggregated.totalBills).toFixed(2)
        : 0,

    averagePerCover:
      aggregated.totalCovers > 0
        ? (aggregated.netSales / aggregated.totalCovers).toFixed(2)
        : 0,

    dineInAvgPerCover:
      aggregated.dineInCovers > 0
        ? (aggregated.dineInNetSales / aggregated.dineInCovers).toFixed(2)
        : 0,

    tabDetails: Object.entries(aggregated.tabDetails).map(
      ([tab, totalOrdersOfTab]) => ({ tab, totalOrdersOfTab })
    ),
  };
}
