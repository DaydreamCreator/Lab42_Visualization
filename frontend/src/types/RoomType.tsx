import { setDisplayInfo, setSensorAvailability } from '../store/roomInfoSlice';
//import { Room, displayInfo, sensorAvailability } from '../types/RoomType';
import { Dispatch } from 'react';


export type floor = 1 | 4;
export const allFloors = [1, 4] as const;


export interface displayInfo{
  roomName: string;
  roomId: number;
  roomType: string;
  roomArea: number;
  roomFloor: number;
};
  

export interface Room {


    id: string;
    room_name: string;
    room_id: number;
    floor: number;
    x: number;
    y: number;
    width: number;
    height: number;
    room_sensors: {temperature: number, airquality: number, daylight: number, light: number};
    description: string;
    area: number;
    type: string;
};



export interface RoomData {
  id: string;
  roomid: number;
  floor: number;
  date: string;
  sensor_data: [{temperature: number, airquality: number, daylight: number, light: number}];
}


export interface DateRange {
  id: string;
  roomid: number;
  floor: number;
  time_start: string;
  time_end: string;
}

export  function updateRoomInfoAndAvailability(allRoomInfo: Room[], roomId: number, dispatch: Dispatch<any>) {
    const currentRoomData = allRoomInfo.find((room: Room) => room.room_id === roomId);
    if (currentRoomData) {
      const thisRoomInfo = {
        roomName: currentRoomData.room_name,
        roomId: currentRoomData.room_id,
        roomType: currentRoomData.type,
        roomArea: currentRoomData.area,
        roomFloor: currentRoomData.floor
      }
      dispatch(setDisplayInfo(thisRoomInfo));
      const thisSensorAvailability = {
        temperature: currentRoomData.room_sensors.temperature === 1,
        airquality: currentRoomData.room_sensors.airquality === 1,
        light: currentRoomData.room_sensors.light === 1,
        daylight: currentRoomData.room_sensors.daylight === 1
      }
      dispatch(setSensorAvailability(thisSensorAvailability));
    }
}
    
  