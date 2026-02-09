import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setMessage: (_, action) => {
      return {
        type: action.payload.type === "error" ? "error" : "success",
        message: action.payload.message,
      };
    },
    clear: () => {
      return null;
    },
  },
});

const { clear, setMessage } = notificationSlice.actions;

// Hook
export const sendNotification = (payload) => (dispatch) => {
  dispatch(setMessage(payload));

  setTimeout(() => {
    dispatch(clear());
  }, 5000);
};

export default notificationSlice.reducer;
