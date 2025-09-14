import { createSlice } from "@reduxjs/toolkit";

const initialState={
    LoanMinAmount:120000.00,
    LoanMinRepayPeriod:1,
    LoanMaxRepayPeriod:48,
    monthsIndicated:1,
    LoanMaxAmount:550000.00,
    MaxToRepay:0.00,
    interest:7.0,
    category:'Building'
}
const BuildingSlice=createSlice({
    name:"Building",
    initialState:initialState,
    reducers:{
        calculateAmountToRepay:(state,action)=>{
            const { amount, months } = action.payload;
            state.MaxToRepay = (amount + (amount * (state.interest / 100) * months));
            state.monthsIndicated=months;
        }
    }
});

export const BuildingReducer=BuildingSlice.reducer;
export const BuildingAction=BuildingSlice.actions;