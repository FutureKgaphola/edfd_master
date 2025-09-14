import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ApplicationRow = {
  id: string;
  user_email: string;
  regNo: string;
    districtId: string;
    status: string;
    outcome: string;
    stageAt: string;
    message: string;
    companyName: string;
    amount: string;
    loanDocs: string;
    applicationRef: string;
    create_date: string;
    last_update: string;
    empno: string;
};

type OriginatorState = {
  isShowList: boolean;
  slectedApplication_Row: ApplicationRow | null;
};

const initialState: OriginatorState = {
  isShowList: false,
  slectedApplication_Row: null,
};

const OriginatorSlice = createSlice({
  name: "selectOriginator",
  initialState,
  reducers: {
    PoupUpModal_Originators: (
      state,
      action: PayloadAction<{
        isShowList: boolean;
        slectedApplication_Row: ApplicationRow;
      }>
    ) => {
      state.isShowList = action.payload.isShowList;
      state.slectedApplication_Row = action.payload.slectedApplication_Row;
    },
  },
});

export const OriginatorSliceReducer = OriginatorSlice.reducer;
export const OriginatorSliceAction = OriginatorSlice.actions;
