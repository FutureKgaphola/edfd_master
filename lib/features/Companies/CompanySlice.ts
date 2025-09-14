import { createSlice } from "@reduxjs/toolkit";

const initialState={
    companies:[]
}
const CompanySlice=createSlice({
    name:"companies",
    initialState:initialState,
    reducers:{
        SetGlobalCompanies:(state,action)=>{
            const { companies } = action.payload;
            state.companies=companies;
        }
    }
});

export const CompanyReducer=CompanySlice.reducer;
export const CompanyAction=CompanySlice.actions;