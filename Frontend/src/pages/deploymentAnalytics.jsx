import React, { useMemo, useState, useEffect } from "react";
import {  useSelector } from "react-redux";

import AnalyticsData from "@/components/analytics-card/data-analytics";
import TabSalesBarChart from "@/components/charts/bar-chart";
import DataCard from "@/components/data-card/data-card";
import SiteHeader from "@/components/site-header/site-header";
import { SectionCards } from "@/components/SiteCards/section-cards";
import { SidebarInset } from "@/components/ui/sidebar";
import { ChartRadialStacked } from "@/components/charts/chart-radial-stack";

import { useGetDeploymentWisedataQuery } from "@/redux/api/deploymentIdApi";

import {
  buildPreviousWeekMap,
  getPreviousWeekDate,
  sheetColumns,
  aggregateByIds,
} from "@/utils/deployments";
import { SkeletonCard } from "@/components/loading";

const DeploymentAnalytics = () => {

  const selectedDate = useSelector((state) => state.date?.selectedDate);
  const selectedGroupDeploymentIds = useSelector(
    (state) => state.deploymentGroup?.deploymentIds ?? []
  );


  const [focusedDeploymentId, setFocusedDeploymentId] = useState(null);


  useEffect(() => {
    setFocusedDeploymentId(null);
  }, [selectedGroupDeploymentIds]);


  const effectiveDate = selectedDate ?? "2025-12-29";
  const previousWeekDate = getPreviousWeekDate(effectiveDate);


  const currentQueryParams = useMemo(() => {
    return selectedGroupDeploymentIds.length > 0
      ? { date: effectiveDate, deploymentIds: selectedGroupDeploymentIds }
      : { date: effectiveDate };
  }, [effectiveDate, selectedGroupDeploymentIds]);

  const previousQueryParams = useMemo(() => {
    return selectedGroupDeploymentIds.length > 0
      ? { date: previousWeekDate, deploymentIds: selectedGroupDeploymentIds }
      : { date: previousWeekDate };
  }, [previousWeekDate, selectedGroupDeploymentIds]);


  const {
    data: deploymentData,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
  } = useGetDeploymentWisedataQuery(currentQueryParams, {
    skip: !effectiveDate,
  });

  const {
    data: previousWeekData,
    isLoading: isPreviousLoading,
    isError: isPreviousError,
  } = useGetDeploymentWisedataQuery(previousQueryParams, {
    skip: !previousWeekDate,
  });


  const deployments = deploymentData?.data ?? [];
  const prevDeployments = previousWeekData?.data ?? [];


  const currentMap = useMemo(
    () => buildPreviousWeekMap(deployments),
    [deployments]
  );

  const prevMap = useMemo(
    () => buildPreviousWeekMap(prevDeployments),
    [prevDeployments]
  );


  const allDeploymentIds = useMemo(
    () => deployments.map((d) => d.deployment_id),
    [deployments]
  );

  const effectiveDeploymentIds = useMemo(() => {
    if (focusedDeploymentId) return [focusedDeploymentId];
    if (selectedGroupDeploymentIds.length > 0)
      return selectedGroupDeploymentIds;
    return allDeploymentIds;
  }, [
    focusedDeploymentId,
    selectedGroupDeploymentIds,
    allDeploymentIds,
  ]);


  const aggregatedDeployment = useMemo(() => {
    if (!effectiveDeploymentIds.length) return null;
    return aggregateByIds(effectiveDeploymentIds, currentMap);
  }, [effectiveDeploymentIds, currentMap]);

  const aggregatedPrevDeployment = useMemo(() => {
    if (!effectiveDeploymentIds.length) return null;
    return aggregateByIds(effectiveDeploymentIds, prevMap);
  }, [effectiveDeploymentIds, prevMap]);

  const displayContextLabel = useMemo(() => {
    if (focusedDeploymentId) {
      return `Showing data for Deployment: ${focusedDeploymentId}`;
    }

    if (selectedGroupDeploymentIds.length > 0) {
      return `Showing data for Group (${selectedGroupDeploymentIds.length} deployments)`;
    }

    return "Showing data for All Deployments";
  }, [focusedDeploymentId, selectedGroupDeploymentIds]);


  const isLoading = isCurrentLoading || isPreviousLoading;
  const isError = isCurrentError || isPreviousError;

  if (isLoading) return <SkeletonCard />;
  if (isError) return <div>Error: Something went wrong</div>;


  return (
    <SidebarInset>
      <SiteHeader
        isDatePicker={true}
        isDeploymentGroup={true}
        headerTitle="Dashboard Overview Per Deployment"
      />
      

      <div className="@container/main flex flex-col gap-4 pt-4 pb-4">
      
        <div className="px-4 lg:px-6 text-sm text-muted-foreground">
          {displayContextLabel}
        </div>

        <SectionCards
          deploymentData={aggregatedDeployment}
          prevData={aggregatedPrevDeployment}
        />

        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <ChartRadialStacked
            title="Orders by Tabs"
            descriptionText="Showing total per tab for the selected date"
            tabDetails={aggregatedDeployment?.tabDetails ?? []}
          />

          <AnalyticsData
            data={aggregatedDeployment}
            prevData={aggregatedPrevDeployment}
            loading={isLoading}
            error={isError}
          />
        </div>

        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <TabSalesBarChart
            title="Top Deployments"
            description="Top performing deployments as per sales"
            data={deployments}
            xKey="deployment_id"
            yKey="netSales"
            onBarClick={() => {}}
            loading={isLoading}
          />

          <DataCard
            description="Per deployment live sales and orders"
            tab="Deployments List"
            data={deployments}
            columns={sheetColumns}
            loading={isLoading}
            onRowClick={(row) => {
              setFocusedDeploymentId((prev) =>
                prev === row.deployment_id ? null : row.deployment_id
              );
            }}
          />
        </div>
      </div>
    </SidebarInset>
  );
};

export default DeploymentAnalytics;
