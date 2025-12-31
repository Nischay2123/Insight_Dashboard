import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const items = createApi({
  reducerPath: "items",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/",
  }),
  endpoints: (builder) => ({

    getDeploymentIds: builder.query({
      query: () => "item_deployement_data",
    }),
    

    getChartItemsData: builder.query({
      query: (deploymentId) => ({
        url: `Top20_item_menu/${deploymentId}`,
        method: "POST",
      }),
    }),
    getItemsData: builder.query({
      query: (deploymentId) => ({
        url: `item_menu/${deploymentId}`,
        method: "POST",
      }),
    }),

    getChartCategoriesData: builder.query({
      query: (deploymentId) => ({
        url: `Top5_category_menu/${deploymentId}`,
        method: "POST",
      }),
    }),
    getCategoriesData: builder.query({
      query: (deploymentId) => ({
        url: `category_data/${deploymentId}`,
        method: "POST",
      }),
    }),

  }),
});

export const {
  useGetDeploymentIdsQuery,
  useLazyGetChartItemsDataQuery,
  useLazyGetItemsDataQuery,
  useLazyGetCategoriesDataQuery,
  useLazyGetChartCategoriesDataQuery
} = items;
