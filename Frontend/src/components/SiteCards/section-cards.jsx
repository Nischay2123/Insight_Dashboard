import React from "react";
import SectionCard from "./section-card";
import { ShoppingBag, Server, Star, DollarSign } from "lucide-react"

const data = [
  {
    description: "Total Revenue",
    number: "$4,250",
    percent: 12,
    icon: DollarSign,
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    description: "Active Orders",
    number: "32",
    percent: -5,
    icon: ShoppingBag,
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    description: "System Uptime",
    number: "99.9%",
    percent: 0,
    icon: Server,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    description: "Avg Rating",
    number: "4.8",
    percent: 0.2,
    icon: Star,
    iconBg: "bg-orange-100 text-orange-600",
  },
]
export const SectionCards = React.memo( () =>{
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
