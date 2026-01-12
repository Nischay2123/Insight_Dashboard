// redux/reducers/deploymentGroupSlice.js
import { createSlice } from "@reduxjs/toolkit";

const deploymentGroupSlice = createSlice({
  name: "deploymentGroup",
  initialState: {
    deploymentIds: [],
  },
  reducers: {
    addDeploymentIds: (state, action) => {
      const ids = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      state.deploymentIds = Array.from(
        new Set([...state.deploymentIds, ...ids])
      );
    },

    removeDeploymentIds: (state, action) => {
      const idsToRemove = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      state.deploymentIds = state.deploymentIds.filter(
        (id) => !idsToRemove.includes(id)
      );
    },

    clearDeploymentIds: (state) => {
      state.deploymentIds = [];
    },
  },
});

export const {
  addDeploymentIds,
  removeDeploymentIds,
  clearDeploymentIds,
} = deploymentGroupSlice.actions;

export default deploymentGroupSlice.reducer;
