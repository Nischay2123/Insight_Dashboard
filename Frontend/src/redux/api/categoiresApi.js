import { baseApi } from "./baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getChartCategoriesData: builder.query({
      query: (deploymentId) => ({
        url: `category/Top5_category_menu/${deploymentId}`,
        method: "POST",
      }),
    }),

    getCategoriesData: builder.query({
      query: (deploymentId) => ({
        url: `category/category_data/${deploymentId}`,
        method: "POST",
      }),
    }),

  }),
});

export const {
  useLazyGetCategoriesDataQuery,
  useLazyGetChartCategoriesDataQuery
} = categoriesApi;
