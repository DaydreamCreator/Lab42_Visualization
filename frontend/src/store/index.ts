import { configureStore } from '@reduxjs/toolkit';
import floorReducer from './floorSlice';
import roomReducer from './roomIdSlice';
import timeReducer from './timeSlice';
import attributeReducer from './attributeSlice';
import patternReducer from './patternSlice';
import roomInfoReducer from './roomInfoSlice';
import allRoomInfoReducer from './allRoomInfoSlice';
import chartDataReducer from './chartDataSlice';
import attributeMapReducer from './attributeMapSlice';
import floorColorReducer from './floorColorSlice';
import multipleClickReducer from './multipleClickSlice';
import clusterMapReducer from './clusterMapSlice';
import clusterReducer from './clusterSlice';
import roomIdMapReducer from './roomIdMapSlice';
import clusterColorReducer from './clusterColorSlice';
export const store = configureStore({
  reducer: {
    floor: floorReducer,
    pattern: patternReducer,
    room: roomReducer,
    time: timeReducer,
    attribute: attributeReducer,
    roomInfo: roomInfoReducer,
    allRoomInfo: allRoomInfoReducer,
    chartData: chartDataReducer,
    attributeMap: attributeMapReducer,
    floorColor: floorColorReducer,
    multipleClick: multipleClickReducer,
    clusterMap: clusterMapReducer,
    cluster: clusterReducer,
    roomIdMap: roomIdMapReducer,
    clusterColor: clusterColorReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 