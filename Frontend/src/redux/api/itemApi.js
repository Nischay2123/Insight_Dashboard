import { baseApi } from "./baseApi";

export const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getChartItemsData: builder.query({
      query: (deploymentId) => ({
        url: `items/Top20_item_menu/${deploymentId}`,
        method: "POST",
      }),
    }),

    getItemsData: builder.query({
      query: (deploymentId) => ({
        url: `items/item_menu/${deploymentId}`,
        method: "POST",
      }),
    }),
    
  }),
});

export const {
  useLazyGetChartItemsDataQuery,
  useLazyGetItemsDataQuery,
} = itemsApi;
