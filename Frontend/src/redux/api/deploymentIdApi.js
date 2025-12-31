import { baseApi } from "./baseApi";

export const deploymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeploymentIds: builder.query({
      query: () => "item_deployement_data",
    }),
  }),
});

export const {
  useGetDeploymentIdsQuery
} = deploymentApi;
