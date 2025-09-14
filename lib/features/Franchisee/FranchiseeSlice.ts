import { createSlice } from "@reduxjs/toolkit";

const initialState={
    LoanMinAmount:2000000.00,
    LoanMinRepayPeriod:1,
    LoanMaxRepayPeriod:12,
    monthsIndicated:1,
    LoanMaxAmount:7500000.00,
    MaxToRepay:0.00,
    interest:6.4,
    category:'Franchisee'
}
const franchiseeSlice=createSlice({
    name:"franchise",
    initialState:initialState,
    reducers:{
        calculateAmountToRepay:(state,action)=>{
            const { amount, months } = action.payload;
            state.MaxToRepay = (amount + (amount * (state.interest / 100) * months));
            state.monthsIndicated=months;
        }
    }
});

export const franchiseReducer=franchiseeSlice.reducer;
export const franchiseAction=franchiseeSlice.actions;