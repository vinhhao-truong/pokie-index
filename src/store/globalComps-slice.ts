import { createSlice } from "@reduxjs/toolkit";
import pokemonStore from "./pokemon-store";

type RootState = ReturnType<typeof pokemonStore.getState>;
type gcState = {
  loading?: boolean;
  searchContent?: string;
};

const initialState: gcState = {
  loading: false,
  searchContent: "",
};

const globalCompsSlice = createSlice({
  name: "globalComps",
  initialState: initialState,
  reducers: {
    startLoading: (state) => {
      return { ...state, loading: true };
    },
    stopLoading: (state) => {
      return { ...state, loading: false };
    },
    setSearchContent: (state, action) => {
      return { ...state, searchContent: action.payload };
    },
  },
});

export const { startLoading, stopLoading, setSearchContent } =
  globalCompsSlice.actions;
export const selectGlobalComps = (state: RootState) => state.globalComps;
export default globalCompsSlice.reducer;
