import { baseApi } from "./baseApi";

export const tabsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getTabChartData: builder.query({
      query: () => "tabs/tab_chart_data",
    }),

    getTabTableData: builder.mutation({
      query: ({ tab }) => ({
        url: `tabs/tab_table_data/${tab}`,
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
