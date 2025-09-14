import { createSlice } from "@reduxjs/toolkit";

const getToken = () => {
    if (typeof window !== "undefined") {
        return sessionStorage?.getItem("utoken");
    }
    return null;
};
const getUser = () => {
    if (typeof window !== "undefined") {
        const user = sessionStorage.getItem("user");
        if(user){
            return JSON.parse(user);
        }
    }
    return null;
};

const initialState = {
    token: getToken(),
    user:getUser()
};

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken: (state, action) => {
            state.token = action.payload?.token;
            state.user=action.payload?.user;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("utoken", action.payload?.token || '');
                sessionStorage.setItem("user", JSON.stringify(action.payload?.user) || '');
            }
        },
        clearAuthToken: (state) => {
            state.token = null;
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("utoken");
                sessionStorage.removeItem("user");
            }
        },
    },
});

export const AuthReducer = AuthSlice.reducer;
export const AuthActions = AuthSlice.actions;
