import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartRadialText } from "./chart-radial-text"

const val=-20
const prev_val=40

const SectionCard = ({ item }) => {
  return (
    <Card className="@container/card py-2 bg-white w-full flex-row items-center justify-between gap-1">
      <div className="flex-1 h-full w-25">
        <ChartRadialText/>
      </div>
      <div className="flex-2 flex flex-col gap-4 ">
      <CardHeader className={"p-0 text-gray-500"}>
        Net Sales
      </CardHeader>
      <CardContent className={"p-0"}>
          <CardTitle className={"text-2xl"}>
              32483028.54
          </CardTitle>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm p-0">
        <CardDescription>
          <div className="flex flex-col text-[0.65rem]">
              <div className="flex justify-between gap-2 text-black">
                {
                  val>0 ? 
                  <span className="flex items-center text-green-700"><IconTrendingUp className="w-4 h-4 text-green-700"/> {val}</span>:
                  <span className="flex items-center text-red-700"><IconTrendingDown className="w-4 h-4 text-red-700"/> {val}</span>
                  
                }
                From last week same day
              </div>
              <div className="flex flex-justify-between gap-2 text-gray-500">
                Progress compared to <span className="text-black">{prev_val}</span>
              </div>
          </div>
        </CardDescription>
      </CardFooter>
      </div>
    </Card>
  )
}

export default SectionCard