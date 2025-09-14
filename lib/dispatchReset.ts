import { useDispatch } from "react-redux";
import { BusinessAction } from "./features/Business/BusinessSlice";
import { franchiseAction } from "./features/Franchisee/FranchiseeSlice";
import { BuildingAction } from "./features/Building/BuildingSlice";
import { ProcureAction } from "./features/Procurement/ProcurementSlice";

export const DispatchResetAll=()=>{
    const dispatch=useDispatch();
    dispatch(BusinessAction.calculateAmountToRepay({ amount: 0.00, months: 0 }));
    dispatch(franchiseAction.calculateAmountToRepay({ amount: 0.00, months: 0 }));
    dispatch(BuildingAction.calculateAmountToRepay({ amount: 0.00, months: 0 }));
    dispatch(ProcureAction.calculateAmountToRepay({ amount: 0.00, months: 0 }));
}