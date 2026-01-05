import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selectedDate: null, // "YYYY-MM-DD"
}

const selectedDateSlice = createSlice({
  name: "selectedDate",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },
    clearSelectedDate: (state) => {
      state.selectedDate = null
    },
  },
})

export const { setSelectedDate, clearSelectedDate } =
  selectedDateSlice.actions

export default selectedDateSlice.reducer
