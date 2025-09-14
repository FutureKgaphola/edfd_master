import { createSlice } from "@reduxjs/toolkit";

const initialState={
    path:'/'
}

const PathSlice=createSlice({
    name:"Path",
    initialState:initialState,
    reducers:{
        setPath:(state,action)=>{
            const{path}=action.payload;
            state.path=path;
        }
    }
})

export const PathReducer=PathSlice.reducer;
export const PathAction=PathSlice.actions;