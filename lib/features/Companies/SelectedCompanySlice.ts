import { createSlice } from "@reduxjs/toolkit";

const initialState={
    regNo:localStorage?.getItem('regNo') ?? "",
    loanCat_id:localStorage?.getItem('loanCat_id') ?? "0",
    email:localStorage?.getItem('email') ?? ""
}
const SelectedCompanySlice=createSlice({
    name:"selectedcompNloanType",
    initialState:initialState,
    reducers:{
        SetGlobalselectedcompReg:(state,action)=>{
            const { regNo} = action.payload;
            state.regNo = regNo;
            if (typeof window !== "undefined") {
                localStorage.setItem("regNo", regNo);
            }
        },
        SetGlobalselectedcompLoanType:(state,action)=>{
            const { loanCat_id } = action.payload;
            state.loanCat_id=loanCat_id;
            if (typeof window !== "undefined") {
                localStorage.setItem("loanCat_id", loanCat_id);
            }
        },
        SetGlobalselectedLeadEmail:(state,action)=>{
            const { email } = action.payload;
            state.email=email;
            if (typeof window !== "undefined") {
                localStorage.setItem("email", email);
            }
        }
    }
});

export const SelectedCompanyReducer=SelectedCompanySlice.reducer;
export const SelectedCompanyAction=SelectedCompanySlice.actions;