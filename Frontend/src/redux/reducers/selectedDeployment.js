import { createSlice } from "@reduxjs/toolkit";


const deploymentSlice = createSlice({
  name: "deployment",
  initialState: {
    deploymentId: null,
  },
  reducers: {
    setDeploymentId: (state, action) => {
      state.deploymentId = action.payload;
    },
    clearDeploymentId: (state) => {
      state.deploymentId = null;
    },
  },
});

export const { setDeploymentId, clearDeploymentId } = deploymentSlice.actions;

export default deploymentSlice.reducer;
