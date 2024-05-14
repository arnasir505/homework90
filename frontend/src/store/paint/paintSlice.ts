import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const paintSlice = createSlice({
  name: 'paint',
  initialState,
  reducers: {},
});

export const paintReducer = paintSlice.reducer;