import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { setDeploymentId } from "@/redux/reducers/selectedDeployment";
import { useGetDeploymentIdsQuery } from "@/redux/api/deploymentIdApi";

const SelectSidebar = () => {
  const dispatch = useDispatch();

  const deploymentId = useSelector(
    (state) => state.deployment.deploymentId
  );

  const {
    data: deployments,
    isSuccess,
    isLoading,
    isError,
    error
  } = useGetDeploymentIdsQuery();

  useEffect(() => {
    const list = deployments?.data ?? deployments;   

    if (isSuccess && list?.length > 0 && !deploymentId) {
      dispatch(setDeploymentId(list[0]._id));
    }
  }, [isSuccess, deployments, deploymentId, dispatch]);

  const handleChange = (v) => {
    dispatch(setDeploymentId(v));
  };

  if (isLoading) return <div className="px-4">Loading deployments…</div>;
  if (isError)
    return (
      <div className="px-4 text-red-500">
        {error?.data?.message || "Failed to load deployments"}
      </div>
    );

  const deploymentList = deployments?.data ?? deployments;

  return (
    <div className="w-full lg:w-auto flex flex-col lg:flex-row items-start lg:items-center gap-3 pb-2 px-4 lg:px-6">
      <Select value={deploymentId ?? ""} onValueChange={handleChange}>
        <SelectTrigger className="w-44 ">
          <SelectValue placeholder="Select deployment" />
        </SelectTrigger>

        <SelectContent>
          {deploymentList?.map((d) => (
            <SelectItem key={d._id} value={d._id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectSidebar;
