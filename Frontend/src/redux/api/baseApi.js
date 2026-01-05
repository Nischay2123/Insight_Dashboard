import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8001/api/v1/",
  }),
  endpoints: () => ({}),   // IMPORTANT (leave empty)
});
