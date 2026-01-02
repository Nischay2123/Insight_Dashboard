import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { ChartContainer } from "../ui/chart"

const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: { label: "Visitors" },
  safari: { label: "Safari", color: "var(--chart-2)" },
}

export function ChartRadialText() {
  return (
      <ChartContainer config={chartConfig} className="w-full h-full">
        
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={40}
            outerRadius={50}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[35, 30]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox?.cx && viewBox?.cy) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-lg font-bold"
                        >
                          {chartData[0].visitors}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 12}
                          className="fill-muted-foreground"
                        >
                          Progress
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>

      </ChartContainer>
  )
}
