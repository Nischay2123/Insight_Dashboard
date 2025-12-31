import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tabs = createApi({
  reducerPath: "tabs",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1",
  }),
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
});

export const {
  useGetTabChartDataQuery,
  useGetTabTableDataMutation
} = tabs;
