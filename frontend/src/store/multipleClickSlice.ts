import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MultipleClickState {
  clickable: boolean;
  clickedRoom: number[];
}

const initialState: MultipleClickState = {
  clickable: false, 
  clickedRoom: [],
};

export const multipleClickSlice = createSlice({
  name: 'multipleClick',
  initialState,
  reducers: {
    setClickable: (state, action: PayloadAction<boolean>) => {
      state.clickable = action.payload;
    },
    setClickedRoom: (state, action: PayloadAction<number[]>) => {
      state.clickedRoom = action.payload;
    },
  },
});

export const { setClickable, setClickedRoom } = multipleClickSlice.actions;
export default multipleClickSlice.reducer; 