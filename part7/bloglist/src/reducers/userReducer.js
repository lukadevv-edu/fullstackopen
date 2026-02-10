import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import { sendNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser: (_, action) => {
      return action.payload;
    },
    removeUser: () => {
      return null;
    },
  },
});

const { removeUser, setUser } = userSlice.actions;

// Thunks

export const setLoggedUser = (payload) => (dispatch) => {
  dispatch(setMessage(payload));

  setTimeout(() => {
    dispatch(clear());
  }, timeoutMs);
};

export const initLoggedUser = () => (dispatch) => {
  const userStorage = localStorage.getItem("user");

  if (userStorage) {
    dispatch(setUser(JSON.parse(userStorage)));
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("user");
  dispatch(removeUser());
};

export const loginUser =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      const user = await loginService.login(username, password);

      dispatch(setUser(user));

      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      dispatch(
        sendNotification({
          message: "wrong username of password",
          alertType: "error",
        }),
      );
    }
  };

export default userSlice.reducer;
