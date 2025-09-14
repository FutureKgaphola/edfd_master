import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isShowForms:false,
    actionClicked:''
}
const AddCompSlice=createSlice({
    name:"AddComp",
    initialState:initialState,
    reducers:{
        AddCompany:(state,action)=>{
            const { isShowForms,actionClicked } = action.payload;
            state.isShowForms=isShowForms;
            state.actionClicked=actionClicked;
        }
    }
});

export const AddCompSliceReducer=AddCompSlice.reducer;
export const AddCompSliceAction=AddCompSlice.actions;