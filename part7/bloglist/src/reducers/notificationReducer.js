import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setMessage: (_, action) => {
      return action.payload;
    },
    clear: () => {
      return null;
    },
  },
});

const { clear, setMessage } = notificationSlice.actions;

// Thunks

export const sendNotification =
  (payload, timeoutMs = 5000) =>
  (dispatch) => {
    dispatch(setMessage(payload));

    setTimeout(() => {
      dispatch(clear());
    }, timeoutMs);
  };

export default notificationSlice.reducer;
