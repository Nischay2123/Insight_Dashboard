import React, { useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";

import { addDays, differenceInDays } from "date-fns";
import { setDateRange } from "@/redux/reducers/data";
import {
  addDeploymentIds,
  removeDeploymentIds,
} from "@/redux/reducers/deploymentGroupSlice";

import { useMediaQuery } from "@/customHooks/desktop";
import { useGetDeploymentGroupsQuery } from "@/redux/api/deploymentIdApi";

import DateRangeControls from "./dataRangeControl";
import SelectSidebar from "./selectSidebar";
import DatePicker from "./datePicker";




const SiteHeader = ({
  isDateFilter = false,
  isDeployment = false,
  isDatePicker = false,
  isDeploymentGroup = false,
  options = [],
  headerTitle,
}) => {
  const [range, setRange] = useState("7d");
  const [dateRange, setDateRangeState] = useState();
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [desktopCalendarOpen, setDesktopCalendarOpen] = useState(false);
  const selectedDeploymentIds = useSelector(
    (state) => state.deploymentGroup?.deploymentIds ?? []
  );


  const isGroupChecked = (group) => {
    if (!group.deployments?.length) return false;

    return group.deployments.every((d) =>
      selectedDeploymentIds.includes(d._id)
    );
  };

  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { data: groupsData } = useGetDeploymentGroupsQuery();
  const deploymentGroups = groupsData?.data ?? [];

  const getIdsFromOtherCheckedGroups = (currentGroupId) => {
    return deploymentGroups
      .filter(
        (g) =>
          g._id !== currentGroupId &&
          isGroupChecked(g) 
      )
      .flatMap((g) => g.deployments.map((d) => d._id));
  };

  const handleGroupToggle = (group, checked) => {

    const ids = group.deployments?.map((d) => d._id) ?? [];
    console.log(ids);
    
    if (checked) {
      dispatch(addDeploymentIds(ids));
    } else {
      const otherGroupIds = getIdsFromOtherCheckedGroups(group._id);

      const idsToRemove = ids.filter(
        (id) => !otherGroupIds.includes(id)
      );

      dispatch(removeDeploymentIds(idsToRemove));
    }
  };

  const applyPresetRange = (value) => {
    const today = new Date();

    if (value === "today") {
      dispatch(
        setDateRange({
          from: today.toISOString(),
          to: today.toISOString(),
        })
      );
    }

    if (value === "yesterday") {
      const y = addDays(today, -1);
      dispatch(
        setDateRange({
          from: y.toISOString(),
          to: y.toISOString(),
        })
      );
    }

    if (value === "7d") {
      dispatch(
        setDateRange({
          from: addDays(today, -7).toISOString(),
          to: today.toISOString(),
        })
      );
    }

    setRange(value);
  };

  const handleCustomSelect = (r) => {
    if (r?.from && !r?.to) {
      setDateRangeState(r);
      return;
    }

    if (r?.from && r?.to) {
      const diff = differenceInDays(r.to, r.from);

      if (diff > 15) {
        alert("Maximum allowed custom range is 15 days");
        return;
      }

      setDateRangeState(r);

      dispatch(
        setDateRange({
          from: r.from.toISOString(),
          to: r.to.toISOString(),
        })
      );

      setRange("custom");
      setDesktopCalendarOpen(false);
      setShowMobileCalendar(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <header className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-2 h-auto lg:h-25">
        <div className="flex items-center gap-2 px-4 lg:p-6">
          <SidebarTrigger className="-ml-1 sm:hidden" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 sm:hidden"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-tight lg:text-2xl">
              {headerTitle ?? "Dashboard Overview"}
            </h1>
            <span className="hidden text-sm text-muted-foreground lg:block">
              Real-time aggregated analytics for all restaurant locations
            </span>
          </div>
        </div>

        {isDeployment && <SelectSidebar options={options} />}


        {/* ---------------- Date Controls ---------------- */}
        {isDateFilter && (
          <DateRangeControls
            range={range}
            dateRange={dateRange}
            desktopCalendarOpen={desktopCalendarOpen}
            isDesktop={isDesktop}
            setDesktopCalendarOpen={setDesktopCalendarOpen}
            setRange={setRange}
            setShowMobileCalendar={setShowMobileCalendar}
            showMobileCalendar={showMobileCalendar}
            applyPresetRange={applyPresetRange}
            handleCustomSelect={handleCustomSelect}
          />
        )}

        {isDatePicker && <DatePicker />}
      </header>

      <div className="flex items-center gap-2 px-4 lg:p-6">
        {isDeploymentGroup && deploymentGroups.length > 0 && (
          <div className="px-4 lg:px-0 flex flex-col gap-2">

            <div className="flex flex-wrap gap-4 border rounded-md p-3">
              {deploymentGroups.map((group) => (
                <label
                  key={group._id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={isGroupChecked(group)}
                    onCheckedChange={(checked) =>
                      handleGroupToggle(group, checked === true)
                    }
                  />
                  {group.name}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SiteHeader);
