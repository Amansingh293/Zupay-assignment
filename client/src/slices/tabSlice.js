import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "allpostspublic",
};

const currentTabSlice = createSlice({
  name: "currentTab",
  initialState,
  reducers: {
    updateCurrentTab: (state, actions) => {
      state.value = actions.payload;
    },
  },
});

export const { updateCurrentTab } = currentTabSlice.actions;

export default currentTabSlice.reducer;
