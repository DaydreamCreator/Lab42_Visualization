import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FloorColorState {
  
    temperature: Record<number, string>;
    airquality: Record<number, string>;
    light: Record<number, string>;
    daylight: Record<number, string>;
  
}

const initialState: FloorColorState = {
    temperature: {},
    airquality: {},
    light: {},
    daylight: {},
};

export const floorColorSlice = createSlice({
  name: 'floorColor',
  initialState,
  reducers: {
    setAttributeColor: (state, action: PayloadAction<{ attribute: string, data: Record<number, string> }>) => {
      if (action.payload.attribute === 'temperature') {
        state.temperature = action.payload.data;
      } else if (action.payload.attribute === 'airquality') {
        state.airquality = action.payload.data;
      } else if (action.payload.attribute === 'light') {
        state.light = action.payload.data;
      } else if (action.payload.attribute === 'daylight') {
        state.daylight = action.payload.data;
      }
    },
    setFloorColor: (state, action: PayloadAction<Map<string, Record<number, string>>>) => {
      state.temperature = action.payload.get('temperature') || {};
      state.airquality = action.payload.get('airquality') || {};
      state.light = action.payload.get('light') || {};
      state.daylight = action.payload.get('daylight') || {};
    }
  },
});

export const { setAttributeColor, setFloorColor } = floorColorSlice.actions;
export default floorColorSlice.reducer; 
