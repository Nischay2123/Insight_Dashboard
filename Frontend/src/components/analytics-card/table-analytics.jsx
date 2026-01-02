import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data = [
  { id: 1, name: "Nischay", role: "Developer", status: "Active" },
  { id: 2, name: "Rahul", role: "Designer", status: "Inactive" },
  { id: 3, name: "Aman", role: "Manager", status: "Active" },
]

export default function AnaylyticsTable() {
  return (
    <Table >

      <TableHeader>
        <TableRow>
          <TableHead className="w-20">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell className="text-right">{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
