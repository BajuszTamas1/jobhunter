import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    token: null,
    user: null
  };



export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setLoginState: (state, {payload}) => {
            state.token = payload.accessToken;
            state.user = payload.user;
        },
        setLogoutState: (state) => {
            state.token = null;
            state.user = null;
        }
    },
})

export const {setLoginState, setLogoutState} = authSlice.actions;
export const selectAuthToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectLoggedIn = (state) => (state.auth.token != null && state.auth.user != null)