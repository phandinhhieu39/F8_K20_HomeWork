import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem("user_info");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

const initialToken = localStorage.getItem("access_token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getInitialUser(),
    token: initialToken,
    isAuthenticated: !!initialToken,
    loading: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { access_token, refresh_token, user } = action.payload;
      state.token = access_token;
      state.isAuthenticated = true;
      if (user) {
        state.user = user;
        localStorage.setItem("user_info", JSON.stringify(user));
      }
      localStorage.setItem("access_token", access_token);
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }
    },
    setUserInfo: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user_info", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
      window.location.href = "/";
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, setUserInfo, logout, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
