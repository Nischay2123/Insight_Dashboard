"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { useSelector } from "react-redux"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const config = {
  delivery: { label: "Delivery", color: "var(--chart-1)" },
  table: { label: "Table", color: "var(--chart-2)" },
  takeout: { label: "Takeout", color: "var(--chart-3)" },
}

function normalizeTabDetails(tabDetails = []) {
  const base = {
    delivery: 0,
    table: 0,
    takeout: 0,
  }

  for (const item of tabDetails) {
    if (base.hasOwnProperty(item.tab)) {
      base[item.tab] = Number(item.totalOrdersOfTab) || 0
    }
  }

  return [base]
}

export function ChartRadialStacked({
  title = "Tab Details",
  descriptionText = "Showing total orders per category",
  tabDetails = [], 
}) {
    
  const selectedDate = useSelector((state) => state.date?.selectedDate)

  const chartData = normalizeTabDetails(tabDetails)
  const dataItem = chartData[0]

  const totalValue = Object.values(dataItem).reduce(
    (sum, value) => sum + value,
    0
  )

  if (!totalValue) return null

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{selectedDate ?? "2025-12-29"}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square w-full max-w-62.5"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <PolarRadiusAxis tick={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox?.cx || !viewBox?.cy) return null
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy - 16}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalValue.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 4}
                        className="fill-muted-foreground"
                      >
                        Orders
                      </tspan>
                    </text>
                  )
                }}
              />
            </PolarRadiusAxis>

            {Object.keys(dataItem).map((key) => (
              <RadialBar
                key={key}
                dataKey={key}
                stackId="a"
                cornerRadius={5}
                fill={config[key].color}
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          {descriptionText}
        </div>
      </CardFooter>
    </Card>
  )
}
