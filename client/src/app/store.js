import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
// import projectReducer from "../features/projects/projectSlice";
// import orderReducer from "../features/orders/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // projects: projectReducer,
    // orders: orderReducer
  },
});
