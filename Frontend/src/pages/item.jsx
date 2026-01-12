import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import TabSalesBarChart from "@/components/charts/bar-chart";
import SiteHeader from "@/components/site-header/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import DataCard from "@/components/data-card/data-card";
import { RightSheetTable } from "@/components/rightSheetTable";

import { useGetDeploymentWiseItemdataMutation,useGetDeploymentWiseCategorydataMutation } from "@/redux/api/deploymentIdApi";

import {
  itemColumns,
  categoryColumns,
  sheetColumns,
} from "@/utils/item";
import { useItemCategoryData } from "@/customHooks/items";
import { SkeletonCard } from "@/components/loading";

const Item = () => {
  const deploymentId = useSelector(
    (state) => state.deployment.deploymentId
  );

  const [open, setOpen] = useState(false);
  const [sheetData, setSheetData] = useState([]);

  const {
    itemsChartData,
    itemsTableData,
    categoriesChartData,
    categoriesTableData,
    isLoading,
    isError,
    errorMessage,
    fetchAll,
  } = useItemCategoryData();

  const [
    getDeploymentWiseItemData,
    { isLoading: isSheetLoading, isError: isSheetError },
  ] = useGetDeploymentWiseItemdataMutation();
  const [
    getDeploymentWiseCategoryData,
    { isLoading: isCategorySheetLoading, isError: isCategorySheetError },
  ] = useGetDeploymentWiseCategorydataMutation();

  useEffect(() => {
    fetchAll(deploymentId);
  }, [deploymentId, fetchAll]);

  const onItemBarClick = async (row) => {
    try {
      const res = await getDeploymentWiseItemData(row.name).unwrap();
      setSheetData(res?.data ?? []);
      setOpen(true);
    } catch (err) {
      console.error("Sheet API failed:", err);
      setSheetData([]);
    }
  };
  const onCategoryBarClick = async (row) => {
    try {
      const res = await getDeploymentWiseCategoryData(row.name).unwrap();
      setSheetData(res?.data ?? []);
      setOpen(true);
    } catch (err) {
      console.error("Sheet API failed:", err);
      setSheetData([]);
    }
  };

  return (
    <SidebarInset>
      <SiteHeader isDeployment headerTitle={"Dashboard Overview Per Item"} />

      {!deploymentId ? (
        <SkeletonCard/>
      ) : isLoading ? (
        <SkeletonCard/>
      ) : isError ? (
        <div className="p-6 text-red-500">{errorMessage}</div>
      ) : (
        <div className="@container/main flex flex-col gap-4 pb-4">
          <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
            <TabSalesBarChart
              title="Top Performing Items"
              description="Top 20 performing items"
              data={itemsChartData}
              xKey="name"
              yKey="totalSubtotal"
              onBarClick={onItemBarClick}
            />

            <DataCard
              description="Includes total sale, quantity and rate"
              tab="Items"
              data={itemsTableData}
              columns={itemColumns}
              onRowClick={onItemBarClick}
            />
          </div>

          <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
            <TabSalesBarChart
              title="Top Performing Categories"
              description="Top 5 performing categories"
              data={categoriesChartData}
              xKey="name"
              yKey="totalSubtotal"
              onBarClick={onCategoryBarClick}
            />

            <DataCard
              description="Includes total sale & quantity"
              tab="Categories"
              data={categoriesTableData}
              columns={categoryColumns}
               onRowClick={onCategoryBarClick}
            />
          </div>
        </div>
      )}

      <RightSheetTable
        open={open}
        onOpenChange={setOpen}
        title="Deployment Wise Sales"
        description="Sales & Quantity grouped by Deployment"
        columns={sheetColumns}
        data={isSheetLoading || isSheetError || isCategorySheetError || isCategorySheetLoading ? [] : sheetData}
      />
    </SidebarInset>
  );
};

export default Item;
