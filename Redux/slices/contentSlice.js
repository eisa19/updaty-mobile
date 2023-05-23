import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tutorials: [],
  newInV16: [],
  newInV15: [],
  tips: [],
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setTutorials: (state, action) => {
      state.tutorials = action.payload;
    },
  },
});

export const { setTutorials } = contentSlice.actions;

export default contentSlice.reducer;

//"ios_app_id": ""
