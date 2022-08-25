import { configureStore } from "@reduxjs/toolkit";
import globalCompsSlice from "./globalComps-slice";

const pokemonStore = configureStore({
  reducer: { globalComps: globalCompsSlice },
});

export default pokemonStore;
