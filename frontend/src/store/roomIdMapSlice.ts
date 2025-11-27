import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoomIdMapState {
  roomIdMap: Record<number, string>;
}

const initialState: RoomIdMapState = {
  roomIdMap: {},
};

export const roomIdMapSlice = createSlice({
  name: 'roomIdMap',
  initialState,
  reducers: {
    setRoomIdMap: (state, action: PayloadAction<Record<number, string>>) => {
      state.roomIdMap = action.payload;
    },
  },
});

export const { setRoomIdMap } = roomIdMapSlice.actions;
export default roomIdMapSlice.reducer; 