import { configureStore } from "@reduxjs/toolkit";
import deploymentReducer from "./reducers/selectedDeployment.js";
import deploymentGroupReducer from "./reducers/deploymentGroupSlice.js";
import selectedDateReducer from "./reducers/date.js";
import { baseApi } from "./api/baseApi.js";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    deployment: deploymentReducer, 
    deploymentGroup: deploymentGroupReducer,
    date: selectedDateReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
    ),
});

