import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "anecdotes",
  initialState: "",
  reducers: {
    change: (_, action) => {
      return action.payload;
    },
  },
});

export const { change } = filterSlice.actions;

export default filterSlice.reducer;
