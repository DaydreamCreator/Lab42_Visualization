import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttributeState {
  currentAttribute: 'temperature' | 'airquality' | 'light' | 'daylight';
}

const initialState: AttributeState = {
  currentAttribute: 'temperature', // by default, the temperature is shown
};

export const attributeSlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {
    setAttribute: (state, action: PayloadAction<'temperature' | 'airquality' | 'light' | 'daylight'>) => {
      state.currentAttribute = action.payload;
    },
  },
});

export const { setAttribute } = attributeSlice.actions;
export default attributeSlice.reducer; 