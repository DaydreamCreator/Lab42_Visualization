import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FloorState {
  currentFloor: 1 | 2 | 3 | 4;
}

const initialState: FloorState = {
  currentFloor: 1, // by default, the first floor is shown
};

export const floorSlice = createSlice({
  name: 'floor',
  initialState,
  reducers: {
    setFloor: (state, action: PayloadAction<1 | 2 | 3 | 4>) => {
      state.currentFloor = action.payload;
    },
  },
});

export const { setFloor } = floorSlice.actions;
export default floorSlice.reducer; 