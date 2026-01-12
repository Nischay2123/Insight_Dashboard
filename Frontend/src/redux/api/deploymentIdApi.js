import { baseApi } from "./baseApi";

export const deploymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeploymentIds: builder.query({
      query: () => "deployment/deployment_data",
    }),

    getDeploymentGroups: builder.query({
      query: () => "deployment/get_deployment_group",
      providesTags: ["DeploymentGroups"],
    }),

    getDeploymentWiseItemdata: builder.mutation({
      query: (name) => ({
        url: "deployment/item_deployment_data",
        method: "POST",
        body: { name },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getDeploymentWiseCategorydata: builder.mutation({
      query: (name) => ({
        url: "deployment/category_deployment_data",
        method: "POST",
        body: { name },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getDeploymentWisedata: builder.query({
      query: ({ date }) => ({
        url: "/deployment/deployment_data",
        method: "POST",
        body: { date },
      }),
    }),

    createDeploymentGroup: builder.mutation({
      query: ({ name, deployments }) => ({
        url: "deployment/create_deployment_group",
        method: "POST",
        body: { name, deployments },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["DeploymentGroups"],
    }),

    deleteDeploymentGroup: builder.mutation({
      query: (groupId) => ({
        url: `deployment/delete_deployment_group/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeploymentGroups"],
    }),
  }),
});

export const {
  useGetDeploymentIdsQuery,
  useGetDeploymentWiseItemdataMutation,
  useGetDeploymentWiseCategorydataMutation,
  useGetDeploymentWisedataQuery,
  useCreateDeploymentGroupMutation,
  useDeleteDeploymentGroupMutation,
  useGetDeploymentGroupsQuery,
} = deploymentApi;
