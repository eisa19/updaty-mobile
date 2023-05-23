import { configureStore } from "@reduxjs/toolkit";

//Reducers
import contentSlice from "./slices/contentSlice";
import adSlice from "./slices/adSlice";

const store = configureStore({
  reducer: {
    content: contentSlice,
    ad: adSlice,
  },
});

export default store;
