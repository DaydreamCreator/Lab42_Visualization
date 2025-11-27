import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { displayInfo } from '../types/RoomType';
import { sensorAvailability } from '../types/SensorType';

interface RoomInfoState {
  displayInfo: displayInfo;
  sensorAvailability: sensorAvailability;
}

const initialState: RoomInfoState = {
   
    displayInfo: {
        roomName: '',
        roomId: 0,
        roomType: '',
        roomArea: 0,
        roomFloor: 0,
    },
    sensorAvailability: {
        temperature: false,
        airquality: false,
        light: false,
        daylight: false,
    },
  
};

export const roomInfoSlice = createSlice({
  name: 'roomInfo',
  initialState,
  reducers: {
    setDisplayInfo: (state, action: PayloadAction<displayInfo>) => {
      state.displayInfo = action.payload;
    },
    setSensorAvailability: (state, action: PayloadAction<sensorAvailability>) => {
      state.sensorAvailability = action.payload;
    },
  },
});

export const { setDisplayInfo, setSensorAvailability } = roomInfoSlice.actions;
export default roomInfoSlice.reducer; 