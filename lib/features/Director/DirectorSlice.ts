import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Director: null,
    openModal: false,
};
const DirectorSlice=createSlice({
    name:"Director",
    initialState:initialState,
    reducers:{
        SetGlobalDirector: (state, action) => {
            const { director, openModal } = action.payload;
            state.Director = director;
            state.openModal = openModal;
        }
    }
});

export const DirectorReducer=DirectorSlice.reducer;
export const DirectorAction=DirectorSlice.actions;