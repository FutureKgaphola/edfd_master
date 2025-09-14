import { createSlice } from "@reduxjs/toolkit";

const initialState={
    LoanMinAmount:1400000.00,
    LoanMinRepayPeriod:1,
    LoanMaxRepayPeriod:18,
    monthsIndicated:1,
    LoanMaxAmount:3500000.00,
    MaxToRepay:0.00,
    interest:8.4,
    category:'Procurement'
}
const ProcureSlice=createSlice({
    name:"Procure",
    initialState:initialState,
    reducers:{
        calculateAmountToRepay:(state,action)=>{
            const { amount, months } = action.payload;
            state.MaxToRepay = (amount + (amount * (state.interest / 100) * months));
            state.monthsIndicated=months;
        }
    }
});

export const ProcureReducer=ProcureSlice.reducer;
export const ProcureAction=ProcureSlice.actions;