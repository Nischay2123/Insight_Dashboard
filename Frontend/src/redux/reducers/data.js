import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
  name: "date",
  initialState: {
    from: null,
    to: null
  },
  reducers: {
    setDateRange: (state, action) => {
      state.from = action.payload.from;
      state.to = action.payload.to;
    },
  },
});

export const { setDateRange } = dateSlice.actions;
export default dateSlice.reducer;
