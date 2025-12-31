import { baseApi } from "./baseApi";

export const tabsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getTabChartData: builder.query({
      query: () => "/tab_chart_data",
    }),

    getTabTableData: builder.mutation({
      query: ({ tab }) => ({
        url: `/tab_table_data/${tab}`,
        method: "POST",
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetTabChartDataQuery,
  useGetTabTableDataMutation
} = tabsApi;
