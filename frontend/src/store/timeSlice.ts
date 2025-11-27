import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimeState {
  currentTime: string;
}

const initialState: TimeState = {
  currentTime: '2024-04-17', // by default, the first floor is shown
};

export const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    setTime: (state, action: PayloadAction<string>) => {
      state.currentTime = action.payload;
    },
  },
});

export const { setTime } = timeSlice.actions;
export default timeSlice.reducer; 