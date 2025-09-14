import { createSlice } from "@reduxjs/toolkit";

const initialState={
    tab:'profile'
}
const TabSlice=createSlice({
    name:"tabslice",
    initialState:initialState,
    reducers:{
        SelectedTab:(state,action)=>{
            const { tab } = action.payload;
            state.tab=tab;
        }
    }
});

export const TabSliceReducer=TabSlice.reducer;
export const TabSliceAction=TabSlice.actions;