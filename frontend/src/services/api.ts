import axios from 'axios';
import { ClusterData, ClusterTrendsData, ClusterDistributionData } from '../types/ClusterType';
import { Room, RoomData, DateRange } from '../types/RoomType';
import { AverageSensorData } from '../types/SensorType';
const API_BASE_URL = 'http://localhost:8080/api';


// the data type of the room data

/*
export interface RoomData {
  id: string;
  roomid: number;
  floor: number;
  date: string;
  sensor_data: [{temperature: number, airquality: number, daylight: number, light: number, time_slot: string, timestamp: string}];
}

export interface SensorData {
  temperature: number;
  airquality: number;
  daylight: number;
  light: number;
  time_slot: string;
  timestamp: string;
}
*/




// the api of the room data
export const roomApi = {

  
  // get the data of the specified room in a specific time range
  getRoomDataByTimeRange: (roomNumber: number, date: string, endDate: string, floor: number) =>
    axios.get<RoomData[]>(`${API_BASE_URL}/data/${floor}/${roomNumber}`, {
      params: {
        date,
        endDate
      }
    }),

  // get multiple rooms data in a specific time range
  getMultipleRoomsDataByTimeRange: (roomNumbers: number[], date: string, endDate: string, floor: number) =>
    axios.get<RoomData[]>(`${API_BASE_URL}/data/${floor}/multiple`, {
      params: {
        rooms: roomNumbers.join(','),
        date,
        endDate
      }
    }),
  // get the data of the specified room in a specific date
  
  getRoomDataByDate: (roomNumber: number, date: string, floor: number) =>
    axios.get<RoomData[]>(`${API_BASE_URL}/data/${floor}/${roomNumber}`, {
      params: {
        date
      }
    }),
  
  // get the info of the room by the floor number
  getInfoByFloor: (floor: number) =>
    axios.get<Room[]>(`${API_BASE_URL}/roominfo/${floor}`),

  // get all the info of the rooms
  getAllRooms: () =>
    axios.get<Room[]>(`${API_BASE_URL}/roominfo/all`),

  // get the data of the specified floor in a specific date
  getDataByDateAndFloor: (floor: number, date: string) =>
    axios.get<AverageSensorData[]>(`${API_BASE_URL}/data/${floor}`, {
      params: {
        date
      }
    }),
  

  // get the cluster of the specified floor and attributes
  getClusterByFloorAndDate: (floor: number, attribute: string, date: string) =>
    axios.get<ClusterData[]>(`${API_BASE_URL}/cluster/${floor}/${attribute}/${date}`),

  // get the cluster of the specified floor and attributes and date
  getClusterByInput: (floor: number, attributes: string, date: string) =>
    axios.get<ClusterData[]>(`${API_BASE_URL}/cluster/${floor}/${attributes}/${date}`),

  // get the cluster number of the specified floor and attributes and date
  getClusterNumber: (floor: number, date: string, attribute: string) =>
    axios.get<number>(`${API_BASE_URL}/cluster/num/${floor}/${date}/${attribute}`),

  // get the similar rooms of the specified floor and attributes and clusterId and date
  getSimilarRoomsByRoomId: (floor: number, roomid: number, date: string) =>
    axios.get<Record<string, number[]>>(`${API_BASE_URL}/cluster/similar/${floor}/${roomid}/${date}`),


  // get the cluster trends of the specified floor and attributes and clusterId
  getClusterTrendsByAttribute: (attribute: string, floor: number, cluster: number) =>
    axios.get<ClusterTrendsData[]>(`${API_BASE_URL}/cluster/trends/${attribute}/${floor}/${cluster}`),

  // get the cluster distribution of the specified floor and attributes and clusterId
  getClusterDistributionByAttribute: (attribute: string, floor: number, cluster: number) =>
    axios.get<ClusterDistributionData[]>(`${API_BASE_URL}/cluster/distribution/${attribute}/${floor}/${cluster}`),

  // get the date range of the specified room
  getDateRangeByRoomId: (roomid: number) =>
    axios.get<DateRange[]>(`${API_BASE_URL}/roominfo/daterange/${roomid}`),

  // get the analysis result of the specified room and date and attribute and sequence
  postAnalysisResult: (category: number, floor: number, roomNumber: number, cluster: number, sequence: number[], attribute: string, date: string) =>
    axios.post<string>(`${API_BASE_URL}/analysis/${category}/${floor}/${roomNumber}`, {
      sequence,
      attribute,
      date,
      cluster
    }),
}; 