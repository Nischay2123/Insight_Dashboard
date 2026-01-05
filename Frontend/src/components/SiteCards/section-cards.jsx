import React from "react";
import SectionCard from "./section-card";

function calculateChange(today, previous) {
  if (previous === 0 || previous == null) return null
  return (((today - previous) / previous) * 100).toFixed(2)
}
function calculateProgress(today, previous) {
  if (previous === 0 || previous == null) return null
  return (((today) / previous) * 100).toFixed(2)
}

function deploymentToMetrics(deployment) {
  if (!deployment || typeof deployment !== "object") return []

  return [
    { name: "Net Sales", today: deployment.netSales },
    { name: "Gross Sales", today: deployment.grossSales },
    { name: "Total Bills", today: deployment.totalBills },
    { name: "Average Per Bill", today: deployment.averagePerBill },
  ]
}


function deploymentToMetricsWithComparison(deployment, prevDeployment) {
  if (!deployment || typeof deployment !== "object") return []

  const prevMetrics = deploymentToMetrics(prevDeployment)

  const prevMap = new Map()
  prevMetrics.forEach(m => {
    prevMap.set(m.name, m.today)
  })

  return deploymentToMetrics(deployment).map(metric => {
    const prevValue = prevMap.get(metric.name)

    return {
      name: metric.name,
      today: metric.today,
      prev: prevValue,
      change: calculateChange(metric.today, prevValue),
      progress : calculateProgress(metric.today,prevValue)
    }
  })
}

export const SectionCards = React.memo( ({ deploymentData={} , prevData={}}) =>{
  const data = deploymentToMetricsWithComparison(deploymentData ,prevData);
  
  return (
    <div
      className="grid grid-cols-1 gap-4 px-4  lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 ">
      {
        data.map((item,index) => (
          <SectionCard key={index} item={item} />
        ))
      }

    </div>
  );
})
