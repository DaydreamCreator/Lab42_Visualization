import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { roomApi } from '../services/api';
import { attributes } from '../types/SensorType';
import { updateRoomInfoAndAvailability } from '../types/RoomType';
import { setAttributeChartData } from '../store/chartDataSlice';
import { setAttributeMap } from '../store/attributeMapSlice';
import { setAttributeColor } from '../store/floorColorSlice';
import { generateColorByDataList, generateColorByCluster } from '../utils/colorUtils';
import { floor, Room } from '../types/RoomType';
import { setClusterMap } from '../store/clusterMapSlice';
import { ClusterData } from '../types/ClusterType';
import { setCluster } from '../store/clusterSlice';
import { setClickedRoom } from '../store/multipleClickSlice';
import { setRoomId } from '../store/roomIdSlice';



export const useRoomData = () => {
  const roomId = useSelector((state: RootState) => state.room.currentRoomId);
  const currentTime = useSelector((state: RootState) => state.time.currentTime);
  const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
  const allRoomInfo = useSelector((state: RootState) => state.allRoomInfo.allRoomInfo);
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
  const currentPattern = useSelector((state: RootState) => state.pattern.currentPattern);
  const clickable = useSelector((state: RootState) => state.multipleClick.clickable);
  const clusterMap = useSelector((state: RootState) => state.clusterMap.clusterMap);
  const clickedRoom = useSelector((state: RootState) => state.multipleClick.clickedRoom);


  const dispatch = useDispatch();

  const handleRoomChange = () => {
    /*
     update the roomInfo, ChartData, and attributeAverage
    @ roomDetails (within the same floor)
    */
    if(currentPattern == 'data'){
      const floorInfo = allRoomInfo[currentFloor as floor] || [];
      updateRoomInfoAndAvailability(floorInfo, roomId, dispatch);

      // update the chartData and attributeAverage
        const response = roomApi.getRoomDataByDate(
        roomId,
        `${currentTime}`,
        currentFloor
      );
      
      // compute the average of the data per attribute
      const newAverage = {
        temperature: 0,
        airquality: 0,
        light: 0,
        daylight: 0
      };
      
      response.then((response) => {
        const roomData = response.data[0].sensor_data;
        console.log(roomData);
        for (const attribute of attributes) {
          const values = roomData.map((item: { temperature: number; airquality: number; daylight: number; light: number; }) => {
            const value = item[attribute];
            return value === null ? 0 : value;
          });
          
          // set the chart data
          dispatch(setAttributeChartData({ attribute: attribute, data: values }));
          newAverage[attribute] = values.reduce((sum: number, value: number) => sum + value, 0) / values.length;
        }
        // set the average data
        dispatch(setAttributeMap({ attributes: newAverage }));
      });
    } else {
      // TODODO
      dispatch(setCluster(clusterMap[roomId]));
    }   
  };

  const updateColorMap = () => {
    if(currentPattern == 'data'){
      const response_floor_data = roomApi.getDataByDateAndFloor(currentFloor, `${currentTime}`);
      response_floor_data.then((response) => {
        const colorList = generateColorByDataList(response.data);
      
        // set the color data
        for (const attribute of attributes) {
          dispatch(setAttributeColor({ attribute: attribute, data: colorList[attribute] }));
        }
      });
    } else {
      // TODODO
    }
    
  };



  const handleRoomClick = (roomId: number) => {
    
    if(clickable){
      dispatch(setClickedRoom([...clickedRoom, roomId]));
    }
    else{
      dispatch(setClickedRoom([roomId]));
      dispatch(setRoomId(roomId));
    }
  };

  return {
    handleRoomChange,
    updateColorMap,
    //handlePatternChange,
    handleRoomClick
  };
};

