import { baseApi } from "./baseApi";

export const tabsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({ 

    getPaymentChartData: builder.query({
      query: ({ date }) => ({
        url: "payments/payment_chart_data",
        method: "POST",
        body: { date },
      }),
    }),

    // getTabTableData: builder.mutation({
    //   query: ({ tab }) => ({
    //     url: `tabs/tab_table_data/${tab}`,
    //     method: "POST",
    //   }),
    // }),

  }),
  overrideExisting: false,
});

export const {
  useGetPaymentChartDataQuery,
//   useGetTabTableDataMutation
} = tabsApi;
