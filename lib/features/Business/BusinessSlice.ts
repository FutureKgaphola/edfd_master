import { createSlice } from "@reduxjs/toolkit";

const initialState={
    LoanMinAmount:420000.00,
    LoanMinRepayPeriod:1,
    LoanMaxRepayPeriod:52,
    monthsIndicated:1,
    LoanMaxAmount:2500000.00,
    MaxToRepay:0.00,
    interest:9.0,
    category:'Business'
}
const BusinessSlice=createSlice({
    name:"Business",
    initialState:initialState,
    reducers:{
        calculateAmountToRepay:(state,action)=>{
            const { amount, months } = action.payload;
            state.MaxToRepay = (amount + (amount * (state.interest / 100) * months));
            state.monthsIndicated=months;
        }
    }
});

export const BusinessReducer=BusinessSlice.reducer;
export const BusinessAction=BusinessSlice.actions;