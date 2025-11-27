import {  Box, Tab, Container } from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import DataSimilarRooms from '../components/DataComponents/DataSimilarRooms';
import * as React from 'react';
import Roomdetails from '../components/DataComponents/Roomdetails';
import CompareData from '../components/DataComponents/CompareData';
import { roomApi } from '../services/api';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
//import { ClusterData } from '../types/clusterType';
import { floor, Room } from '../types/RoomType';
import { setClickable } from '../store/multipleClickSlice';



const Data = () => {
  const [mode, setMode] = React.useState('1');
  const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
  const currentTime = useSelector((state: RootState) => state.time.currentTime);
  const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
  const allRoomInfo = useSelector((state: RootState) => state.allRoomInfo.allRoomInfo);
  const [similarRooms, setSimilarRooms] = React.useState<Record<string, number[]>>({});
  //const [similarRoomInfo, setSimilarRoomInfo] = React.useState<Record<string, number[]>>({});

  //const [clusterId, setClusterId] = React.useState<Record<string, number>>({});
  const dispatch = useDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setMode(newValue);
  };

  const handleSetSimilarRoom = () => {
    roomApi.getSimilarRoomsByRoomId(currentFloor, currentRoomId,  `${currentTime}`).then((response) => {
      
      
      
      setSimilarRooms(response.data);

      //setClusterId({...clusterId, [currentAttribute]: response.data[0].cluster});
      /*
      const roomInfo = allRoomInfo[currentFloor as floor];
      const newSimilarRoomInfo: Record<number, string> = {};
      for(const room of response.data){
        const roomName = roomInfo.find((r: Room) => r.room_id === room.roomid)?.room_name;
        console.log(room.roomid, roomName);
        if(roomName){
          newSimilarRoomInfo[room.roomid] = roomName;
        }else{
          newSimilarRoomInfo[room.roomid] = "Room not found";
        }
      }
      //setSimilarRoomInfo(newSimilarRoomInfo);
      */
    });
  }


  useEffect(() => {
    if(mode == "3"){
      handleSetSimilarRoom();
    }else if(mode == "2"){
        // set the data map as multiple clickable buttons
        const dataMap = allRoomInfo[currentFloor as floor].map((room: Room) => ({
          roomid: room.room_id,
          roomname: room.room_name
        }));
        console.log(dataMap);
    }
    dispatch(setClickable(false));
  }, [mode]);

  useEffect(() => {
    if(mode == "3"){

      handleSetSimilarRoom();
      //console.log(similarRooms);
    }
  }, [currentRoomId, currentAttribute, currentTime, currentFloor]);

  const tabStyle = {
    fontSize: '15px',
    width: '180px'
  }
  return (
    <div>
      <Box >
        <Container sx={{ width: '90%', marginLeft: '-10px'}}>
          
        <TabContext value={mode}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="basic tabs example" sx={{width:'540px'}}>
              <Tab label="Room Details" value="1" sx={tabStyle} />
              <Tab label="Compare" value="2" sx={tabStyle} />
              <Tab label="Similar Rooms" value="3" sx={tabStyle} />
            </TabList>
          </Box>
          <TabPanel value="1"><Roomdetails /></TabPanel>
          <TabPanel value="2"><CompareData /></TabPanel>
          <TabPanel value="3"><DataSimilarRooms similarRooms={similarRooms} roomId={currentRoomId} /></TabPanel>
        </TabContext>
        </Container>
        
      </Box>
    </div>
  );
};

export default Data; 