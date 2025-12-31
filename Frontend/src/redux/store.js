import { configureStore } from "@reduxjs/toolkit";
import { tabs } from "./api/tab.js";
import deploymentReducer from "./reducers/selectedDeployment.js";
import { items } from "./api/menu.js";

export const store = configureStore({
  reducer: {
    [tabs.reducerPath]: tabs.reducer,
    [items.reducerPath]: items.reducer,
    deployment: deploymentReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tabs.middleware,
      items.middleware
    ),
});

