import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: !!localStorage.getItem("zupayAuthToken"),
};

const loginStateSlice = createSlice({
  name: "loginState",
  initialState,
  reducers: {
    updateLoginState: (state) => {
      state.value = !!localStorage.getItem("zupayAuthToken");
    },
  },
});

export const { updateLoginState } = loginStateSlice.actions;

export default loginStateSlice.reducer;
