import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PatternState {
  currentPattern: 'pattern' | 'data';
}

const initialState: PatternState = {
  currentPattern: 'data', 
};

export const patternSlice = createSlice({
  name: 'pattern',
  initialState,
  reducers: {
    setPattern: (state, action: PayloadAction<'pattern' | 'data'>) => {
      state.currentPattern = action.payload;
    },
  },
});

export const { setPattern } = patternSlice.actions;
export default patternSlice.reducer; 