// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../src/slices/loginSlice";
import currentTabReducer from "../src/slices/tabSlice";


export const store = configureStore({
  reducer: {
    loginState: loginReducer,
    currentTab: currentTabReducer,
  },
});
