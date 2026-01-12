import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AnalyticsData from "@/components/analytics-card/data-analytics";
import TabSalesBarChart from "@/components/charts/bar-chart";
import DataCard from "@/components/data-card/data-card";
import SiteHeader from "@/components/site-header/site-header";
import { SectionCards } from "@/components/SiteCards/section-cards";
import { SidebarInset } from "@/components/ui/sidebar";
import { ChartRadialStacked } from "@/components/charts/chart-radial-stack";

import { useGetDeploymentWisedataQuery } from "@/redux/api/deploymentIdApi";
import { clearDeploymentIds } from "@/redux/reducers/deploymentGroupSlice";

import {
  buildPreviousWeekMap,
  getPreviousWeekDate,
  sheetColumns,
  aggregateByIds,
} from "@/utils/deployments";

const DeploymentAnalytics = () => {
  const dispatch = useDispatch();

  const selectedDate = useSelector((state) => state.date?.selectedDate);
  const selectedGroupDeploymentIds = useSelector(
    (state) => state.deploymentGroup?.deploymentIds ?? []
  );

  const effectiveDate = selectedDate ?? "2025-12-29";
  const previousWeekDate = getPreviousWeekDate(effectiveDate);

  const {
    data: deploymentData,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
  } = useGetDeploymentWisedataQuery(
    { date: effectiveDate },
    { skip: !effectiveDate }
  );

  const {
    data: previousWeekData,
    isLoading: isPreviousLoading,
    isError: isPreviousError,
  } = useGetDeploymentWisedataQuery(
    { date: previousWeekDate },
    { skip: !previousWeekDate }
  );

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

  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [selectedPrevDeployment, setSelectedPrevDeployment] = useState(null);

  useEffect(() => {
    if (!deployments.length) return;

    setSelectedDeployment((prev) => {
      const deployment = prev ?? deployments[0];
      setSelectedPrevDeployment(
        prevMap.get(deployment.deployment_id) ?? null
      );
      return deployment;
    });
  }, [deployments, prevMap]);

  const aggregatedDeployment = useMemo(() => {
    if (!selectedGroupDeploymentIds.length) return null;
    return aggregateByIds(selectedGroupDeploymentIds, currentMap);
  }, [selectedGroupDeploymentIds, currentMap]);

  useEffect(() => {
  if (selectedGroupDeploymentIds.length > 0) {
    setSelectedDeployment(null);
    setSelectedPrevDeployment(null);
  }
}, [selectedGroupDeploymentIds]);


  const aggregatedPrevDeployment = useMemo(() => {
    if (!selectedGroupDeploymentIds.length) return null;
    return aggregateByIds(selectedGroupDeploymentIds, prevMap);
  }, [selectedGroupDeploymentIds, prevMap]);

  const finalDeploymentData =
    selectedGroupDeploymentIds.length > 0
      ? aggregatedDeployment
      : selectedDeployment;

  const finalPrevDeploymentData =
    selectedGroupDeploymentIds.length > 0
      ? aggregatedPrevDeployment
      : selectedPrevDeployment;

  const isLoading = isCurrentLoading || isPreviousLoading;
  const isError = isCurrentError || isPreviousError;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: Something went wrong</div>;

  return (
    <SidebarInset>
      <SiteHeader
        isDatePicker={true}
        isDeploymentGroup={true}
        headerTitle="Dashboard Overview Per Deployment"
      />

      <div className="@container/main flex flex-col gap-4 pb-4">
        <SectionCards
          deploymentData={finalDeploymentData}
          prevData={finalPrevDeploymentData}
        />

        <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
          <ChartRadialStacked
            title="Orders by Tabs"
            descriptionText="Showing total per tab for the selected date"
            tabDetails={finalDeploymentData?.tabDetails ?? []}
          />

          <AnalyticsData
            data={finalDeploymentData}
            prevData={finalPrevDeploymentData}
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
            selectedRowId={selectedDeployment?.deployment_id}
            onRowClick={(row) => {
              dispatch(clearDeploymentIds());
              setSelectedDeployment(row);
              setSelectedPrevDeployment(
                prevMap.get(row.deployment_id) ?? null
              );
            }}
          />
        </div>
      </div>
    </SidebarInset>
  );
};

export default DeploymentAnalytics;
