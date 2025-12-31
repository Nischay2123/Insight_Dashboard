import { configureStore } from "@reduxjs/toolkit";
import deploymentReducer from "./reducers/selectedDeployment.js";
import { baseApi } from "./api/baseApi.js";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    deployment: deploymentReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
    ),
});

