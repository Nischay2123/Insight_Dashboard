import { baseApi } from "./baseApi";

export const deploymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeploymentIds: builder.query({
      query: () => "deployment/deployment_data",
    }),
    getDeploymentWiseItemdata: builder.mutation({
      query: (name) => ({
        url: "deployment/item_deployment_data",
        method: "POST",
        body:  {name },
        headers:{
          "Content-Type":"application/json"
        }
      }),
    }),

  }),
});

export const {
  useGetDeploymentIdsQuery,
  useGetDeploymentWiseItemdataMutation
} = deploymentApi;
