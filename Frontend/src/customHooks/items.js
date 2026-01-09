import { useCallback } from "react";

import {
  useLazyGetChartItemsDataQuery,
  useLazyGetItemsDataQuery,
} from "@/redux/api/itemApi";

import {
  useLazyGetCategoriesDataQuery,
  useLazyGetChartCategoriesDataQuery,
} from "@/redux/api/categoiresApi";

export function useItemCategoryData() {
  const [getChartItemsData, chartItemsState] =
    useLazyGetChartItemsDataQuery();

  const [getItemsData, itemsState] =
    useLazyGetItemsDataQuery();

  const [getChartCategoriesData, chartCategoriesState] =
    useLazyGetChartCategoriesDataQuery();

  const [getCategoriesData, categoriesState] =
    useLazyGetCategoriesDataQuery();

  const fetchAll = useCallback(
    (deploymentId) => {
      if (!deploymentId) return;

      getChartItemsData(deploymentId);
      getItemsData(deploymentId);
      getChartCategoriesData(deploymentId);
      getCategoriesData(deploymentId);
    },
    [
      getChartItemsData,
      getItemsData,
      getChartCategoriesData,
      getCategoriesData,
    ]
  );

  const isLoading =
    chartItemsState.isLoading ||
    itemsState.isLoading ||
    chartCategoriesState.isLoading ||
    categoriesState.isLoading;

  const isError =
    chartItemsState.isError ||
    itemsState.isError ||
    chartCategoriesState.isError ||
    categoriesState.isError;

  const errorMessage =
    itemsState.error?.data?.message ||
    chartItemsState.error?.data?.message ||
    categoriesState.error?.data?.message ||
    chartCategoriesState.error?.data?.message ||
    "Failed to load data";

  return {
    itemsChartData: chartItemsState.data?.data ?? [],
    itemsTableData: itemsState.data?.data ?? [],
    categoriesChartData: chartCategoriesState.data?.data ?? [],
    categoriesTableData: categoriesState.data?.data ?? [],

    isLoading,
    isError,
    errorMessage,

    fetchAll,
  };
}
