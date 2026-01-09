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

    getPaymentTableData: builder.mutation({
      query: ({ paymentMode,date }) => ({
        url: `payments/payment_table_data/${paymentMode}/${date}`,
        method: "POST",
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetPaymentChartDataQuery,
  useGetPaymentTableDataMutation
} = tabsApi;
