import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, floor } from '../types/RoomType';

interface AllRoomInfoState {
  allRoomInfo: Record<floor, Room[]>;
}


const initialState: AllRoomInfoState = {
  allRoomInfo: {
    1: [],
    4: [],
  },
};



export const allRoomInfoSlice = createSlice({
  name: 'allRoomInfo',
  initialState,
  reducers: {
   
    setOneRoomInfo: (state, action: PayloadAction<{ floor: floor, room: Room[] }>) => {
      state.allRoomInfo[action.payload.floor] = action.payload.room;
    },
    
  },
});

export const { setOneRoomInfo } = allRoomInfoSlice.actions;
export default allRoomInfoSlice.reducer; 