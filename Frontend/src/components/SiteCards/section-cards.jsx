import React from "react";
import SectionCard from "./section-card";

function deploymentToMetrics(deployment) {
  if (!deployment || typeof deployment !== "object") return []

  return [
    { name: "Net Sales", today: deployment.netSales },
    { name: "Gross Sales", today: deployment.grossSales },
    { name: "Total Bills", today: deployment.totalBills },
    { name: "Average Per Bill", today: deployment.averagePerBill },
  ]
}


export const SectionCards = React.memo( ({ deploymentData }) =>{
  const data = deploymentToMetrics(deploymentData ?? []);
  
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
