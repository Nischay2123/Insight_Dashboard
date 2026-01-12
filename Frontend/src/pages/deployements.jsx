import { useState } from "react";
import DataCard from "@/components/data-card/data-card";
import {
  useGetDeploymentIdsQuery,
  useCreateDeploymentGroupMutation,
  useGetDeploymentGroupsQuery,
} from "@/redux/api/deploymentIdApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { SidebarInset } from "@/components/ui/sidebar";
import SiteHeader from "@/components/site-header/site-header";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];

const Deployemnts = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [groupName, setGroupName] = useState("");

  const [createDeploymentGroup, { isLoading: isCreating }] =
    useCreateDeploymentGroupMutation();

  const {
    data: deployments,
    isLoading,
    isError,
    error,
  } = useGetDeploymentIdsQuery();

  const {
    data: groupsData,
    isLoading: isGroupsLoading,
  } = useGetDeploymentGroupsQuery();

  const deploymentList = deployments?.data ?? deployments ?? [];
  const deploymentGroups = groupsData?.data ?? [];

  if (isLoading) return <div className="px-6">Loading deployments…</div>;

  if (isError)
    return (
      <div className="px-6 text-red-500">
        {error?.data?.message || "Failed to load deployments"}
      </div>
    );

  const handleRowClick = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row._id)
        ? prev.filter((id) => id !== row._id)
        : [...prev, row._id]
    );
  };

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();

    if (!trimmedName || !selectedRows.length) return;

    const deploymentsPayload = deploymentList
      .filter((d) => selectedRows.includes(d._id))
      .map((d) => ({
        _id: d._id,
        name: d.name,
      }));

    try {
      await createDeploymentGroup({
        name: trimmedName,
        deployments: deploymentsPayload,
      }).unwrap();

      setSelectedRows([]);
      setGroupName("");
    } catch (err) {
      console.error("Failed to create deployment group", err);
    }
  };

  return (
    <SidebarInset>
      <SiteHeader headerTitle={"Deployment Configiuration Setting"} />
    <div className="w-full h-full p-6 space-y-6">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Deployment Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="px-3 py-2 border rounded-md w-72"
        />

        <button
          onClick={handleCreateGroup}
          disabled={isCreating || !groupName.trim() || !selectedRows.length}
          className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50"
        >
          {isCreating ? "Creating..." : "Create Group"}
        </button>
      </div>

      <DataCard
        description="All Deployments"
        tab="Deployemnts"
        columns={columns}
        data={deploymentList}
        onRowClick={handleRowClick}
      />

      <Card>
        <CardHeader>
          <CardTitle>Deployment Groups</CardTitle>
        </CardHeader>

        <CardContent>
          {isGroupsLoading ? (
            <div>Loading groups…</div>
          ) : deploymentGroups.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No deployment groups created yet.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {deploymentGroups.map((group) => (
                <AccordionItem key={group._id} value={group._id}>
                  <AccordionTrigger className="flex justify-between">
                    <span>{group.name}</span>
                    <Badge variant="secondary">
                      {group.deployments?.length || 0}
                    </Badge>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-2 pl-2">
                      {group.deployments?.map((dep) => (
                        <div
                          key={dep._id}
                          className="flex justify-between text-sm border-b pb-1"
                        >
                          <span className="font-mono text-xs">
                            {dep._id}
                          </span>
                          <span>{dep.name}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
    </SidebarInset>
  );
};

export default Deployemnts;
