
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DataTable } from "./data-card/table-card";

export function RightSheetTable({
  open,
  onOpenChange,
  title = "Details",
  description = "",
  columns = [],
  data = [],
}) {
  const colWidth = 200           
  const minWidth = 400
  const maxWidth = 1000

  const sheetWidth = Math.min(
    maxWidth,
    Math.max(minWidth, columns.length * colWidth)
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-none"
        style={{ width: sheetWidth }}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="m-6 h-full rounded-md">
          <DataTable columns={columns} data={data} selectedRowId={""}/>
        </div>
      </SheetContent>
    </Sheet>
  );
}

