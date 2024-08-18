import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface layoutSliceState {
  sidebarExpanded: boolean;
}

const initialState: layoutSliceState = {
  sidebarExpanded: localStorage.getItem("sidebarExpanded")
    ? localStorage.getItem("sidebarExpanded") === "true"
    : true,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setSidebarExpanded: (state, action: PayloadAction<boolean>) => {
      state.sidebarExpanded = action.payload;
      localStorage.setItem("sidebarExpanded", `${state.sidebarExpanded}`);
    },
  },
});

export const { setSidebarExpanded } = layoutSlice.actions;

export default layoutSlice.reducer;
