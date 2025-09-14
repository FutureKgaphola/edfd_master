import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userId:'',
    applicationId:''
}
const TackApplicationSlice=createSlice({
    name:"TackApplication",
    initialState:initialState,
    reducers:{
        TrackwithEmailNRef:(state,action)=>{
            const { userId,applicationId } = action.payload;
            state.userId=userId;
            state.applicationId=applicationId;
        }
    }
});

export const TackApplicationReducer=TackApplicationSlice.reducer;
export const TackApplicationAction=TackApplicationSlice.actions;