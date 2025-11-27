import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoomState {
  currentRoomId: number;
}

const initialState: RoomState = {
  currentRoomId: 29, // by default, the first floor is shown
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<number>) => {
      state.currentRoomId = action.payload;
    },
  },
});

export const { setRoomId } = roomSlice.actions;
export default roomSlice.reducer; 