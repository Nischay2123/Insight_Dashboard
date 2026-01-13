import { useCallback, useState } from "react";
import DataCard from "@/components/data-card/data-card";
import {
  useGetDeploymentIdsQuery,
  useCreateDeploymentGroupMutation,
  useGetDeploymentGroupsQuery,
  useDeleteDeploymentGroupMutation,
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
import ErrorState from "@/components/error";
import { SkeletonCard } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";



const Deployemnts = () => {
  const [rowSelection, setRowSelection] = useState({});
  const selectedDeploymentIds = Object.keys(rowSelection);

  const [groupName, setGroupName] = useState("");

  const [createDeploymentGroup, { isLoading: isCreating }] =
    useCreateDeploymentGroupMutation();

  const [deleteDeploymentGroup, { isLoading: isDeleting }] =
    useDeleteDeploymentGroupMutation();

  const {
    data: deployments,
    isLoading,
    isError,
  } = useGetDeploymentIdsQuery();

  const {
    data: groupsData,
    isLoading: isGroupsLoading,
  } = useGetDeploymentGroupsQuery();

  const columns =
    [
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
    ]

  const deploymentList = deployments?.data ?? deployments ?? [];
  const deploymentGroups = groupsData?.data ?? [];

  if (isLoading) return <SkeletonCard />;
  if (isError) return <ErrorState />;

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();
    if (!trimmedName || !selectedDeploymentIds.length) return;

    const deploymentsPayload = deploymentList
      .filter((d) => selectedDeploymentIds.includes(d._id))
      .map((d) => ({ _id: d._id, name: d.name }));

    try {
      await createDeploymentGroup({
        name: trimmedName,
        deployments: deploymentsPayload,
      }).unwrap();

      setRowSelection({});
      setGroupName("");
    } catch (err) {
      console.error("Failed to create deployment group", err);
    }
  };


  const handleEditGroup = (group) => {
    console.log("Edit group:", group);
  };

  const handleDeleteGroup = async (groupId) => {
    if (!groupId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this deployment group?"
    );

    if (!confirmed) return;

    try {
      await deleteDeploymentGroup(groupId).unwrap();
    } catch (err) {
      console.error("Failed to delete deployment group", err);
    }
  };

  return (
    <SidebarInset>
      <SiteHeader headerTitle="Deployment Configuration Setting" />

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
            disabled={isCreating || !groupName.trim()}
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
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
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
                    <div className="flex items-center justify-between px-3 py-2">
                      {/* Trigger */}
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <span className="font-medium truncate">
                          {group.name}
                        </span>
                      </AccordionTrigger>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {group.deployments?.length || 0}
                        </Badge>

                        {/* <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-yellow-500 hover:text-yellow-600 hover:bg-amber-200"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button> */}

                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isDeleting}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-200 disabled:opacity-50"
                          onClick={() => handleDeleteGroup(group._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

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
