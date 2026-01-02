import React, { useEffect, useState } from "react";
import TabSalesBarChart from "@/components/charts/bar-chart";
import SiteHeader from "@/components/site-header/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import DataCard from "@/components/data-card/data-card";
import { useSelector } from "react-redux";

import {
  useLazyGetChartItemsDataQuery,
  useLazyGetItemsDataQuery,
} from "@/redux/api/itemApi";

import {
  useLazyGetCategoriesDataQuery,
  useLazyGetChartCategoriesDataQuery,
} from "@/redux/api/categoiresApi";

import { RightSheetTable } from "@/components/rightSheetTable";
import { useGetDeploymentWiseItemdataMutation } from "@/redux/api/deploymentIdApi";

const itemColumns = [
  { accessorKey: "name", header: "Item name" },
  { accessorKey: "totalQuantity", header: "Quantity Sold" },
  { accessorKey: "totalSubtotal", header: "Gross Sales" },
  { accessorKey: "rate", header: "Price" },
];

const categoryColumns = [
  { accessorKey: "name", header: "Category" },
  { accessorKey: "totalQuantity", header: "Quantity Sold" },
  { accessorKey: "totalSubtotal", header: "Gross Sales" },
];

const sheetColumns = [
  { accessorKey: "_id", header: "Deployment Id" },
  { accessorKey: "totalQuantity", header: "Quantity" },
  { accessorKey: "grossSale", header: "Total Sales" },
];

const Item = () => {
  const [open, setOpen] = useState(false);
  const [sheetData, setSheetData] = useState([]);

  const deploymentId = useSelector(
    (state) => state.deployment.deploymentId
  );

  const [
    getChartItemsData,
    {
      data: apiChartItemsData = [],
      isLoading: isLoadingChartItems,
      isError: isErrorChartItems,
      error: chartItemsError,
    },
  ] = useLazyGetChartItemsDataQuery();

  const [
    getItemsData,
    {
      data: apiItemsData = [],
      isLoading: isLoadingItems,
      isError: isErrorItems,
      error: itemsError,
    },
  ] = useLazyGetItemsDataQuery();

  const [
    getChartCategoriesData,
    {
      data: apiChartCategoriesData = [],
      isLoading: isLoadingChartCategories,
      isError: isErrorChartCategories,
      error: chartCategoriesError,
    },
  ] = useLazyGetChartCategoriesDataQuery();

  const [
    getCategoriesData,
    {
      data: apiCategoriesData = [],
      isLoading: isLoadingCategories,
      isError: isErrorCategories,
      error: categoriesError,
    },
  ] = useLazyGetCategoriesDataQuery();

  const [
    getDeploymentWiseData,
    { isLoading: isSheetLoading, isError: isSheetError },
  ] = useGetDeploymentWiseItemdataMutation();

  useEffect(() => {
    if (deploymentId) {
      getChartItemsData(deploymentId);
      getItemsData(deploymentId);
      getChartCategoriesData(deploymentId);
      getCategoriesData(deploymentId);
    }
  }, [
    deploymentId,
    getItemsData,
    getChartItemsData,
    getCategoriesData,
    getChartCategoriesData,
  ]);

  const isLoading =
    isLoadingItems ||
    isLoadingChartItems ||
    isLoadingCategories ||
    isLoadingChartCategories;

  const isError =
    isErrorItems ||
    isErrorChartItems ||
    isErrorCategories ||
    isErrorChartCategories;

  const onBarClick = async (row) => {
    try {
      const res = await getDeploymentWiseData(row.name).unwrap();
      setSheetData(res?.data ?? res ?? []);
      setOpen(true);
    } catch (err) {
      console.error("Sheet API failed:", err);
      setSheetData([]);
    }
  };

  return (
    <SidebarInset>
      <SiteHeader isDeployment={true} />

      {!deploymentId ? (
        <div className="p-6">Loading deployments…</div>
      ) : isLoading ? (
        <div className="p-6">Loading data…</div>
      ) : isError ? (
        <div className="p-6 text-red-500">
          {itemsError?.data?.message ||
            chartItemsError?.data?.message ||
            categoriesError?.data?.message ||
            chartCategoriesError?.data?.message ||
            "Failed to load data"}
        </div>
      ) : (
        <div className="@container/main flex flex-col gap-4 pb-4">
          <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
            <TabSalesBarChart
              title="Top Performing Items"
              description="Top 20 performing items"
              data={apiChartItemsData?.data ?? []}
              xKey="name"
              yKey="totalSubtotal"
              onBarClick={onBarClick}
            />

            <DataCard
              description="Includes total sale, quantity and rate"
              tab="Items"
              data={apiItemsData?.data ?? []}
              columns={itemColumns}
            />
          </div>

          <div className="flex flex-col gap-4 px-4 lg:px-6 lg:flex-row">
            <TabSalesBarChart
              title="Top Performing Categories"
              description="Top 5 performing categories"
              data={apiChartCategoriesData?.data ?? []}
              xKey="name"
              yKey="totalSubtotal"
            />

            <DataCard
              description="Includes total sale & quantity"
              tab="Categories"
              data={apiCategoriesData?.data ?? []}
              columns={categoryColumns}
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
        data={isSheetLoading || isSheetError ? [] : sheetData}
      />
    </SidebarInset>
  );
};

export default Item;
