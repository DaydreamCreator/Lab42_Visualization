import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttributeMapState {
  attributes: {
    temperature: number;
    airquality: number;
    light: number;
    daylight: number;
  }
}

const initialState: AttributeMapState = {
  attributes: {
    temperature: 0,
    airquality: 0,
    light: 0,
    daylight: 0,
  }
};

export const attributeMapSlice = createSlice({
  name: 'attributeMap',
  initialState,
  reducers: {
    setAttributeMap: (state, action: PayloadAction<AttributeMapState>) => {
      state.attributes = action.payload.attributes;
    },
  },
});

export const { setAttributeMap } = attributeMapSlice.actions;
export default attributeMapSlice.reducer; 