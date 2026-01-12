import { baseApi } from "./baseApi";

export const tabsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({ 

    getTabChartData: builder.query({
      query: ({ date }) => ({
        url: "/tabs/tab_chart_data",
        method: "POST",
        body: { date },
      }),
    }),

    getTabTableData: builder.mutation({
      query: ({ tab,date }) => ({
        url: `tabs/tab_table_data/${tab}/${date}`,
        method: "POST",
      }),
    }),

  })
});

export const {
  useGetTabChartDataQuery,
  useGetTabTableDataMutation
} = tabsApi;
