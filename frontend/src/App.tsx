import { ThemeProvider, CssBaseline, Container, Box, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Pattern from './pages/Pattern';
import Data from './pages/Data';

import Floorfirst from './components/Floorfirst';
import Floorfourth from './components/Floorfourth';
//import Dropdown from '../components/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from './store';
import DetailHeader from './components/DetailHeader';
import './index.css';


import { useRoomData } from './hooks/useRoomData';
import { roomApi } from './services/api';
import { floor, allFloors, updateRoomInfoAndAvailability } from './types/RoomType';
import { setOneRoomInfo } from './store/allRoomInfoSlice';
import { setRoomId } from './store/roomIdSlice';
import { setClickedRoom } from './store/multipleClickSlice';
import { setRoomIdMap } from './store/roomIdMapSlice';
import { setCluster } from './store/clusterSlice';
import { ClusterData } from './types/ClusterType';
import { setClusterMap } from './store/clusterMapSlice';
import { generateColorByCluster } from './utils/colorUtils';
import { setAttributeColor } from './store/floorColorSlice';
import { setClickable } from './store/multipleClickSlice';
import { setClusterColor } from './store/clusterColorSlice';
import { clusterColorList } from './utils/colorUtils';
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3E3F5B',
    },
    secondary: {
      main: '#F5EEDC',
    },
  },
});

function App() {

  const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
  const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
  const currentTime = useSelector((state: RootState) => state.time.currentTime);
  const currentPattern = useSelector((state: RootState) => state.pattern.currentPattern);
  const allRoomInfo = useSelector((state: RootState) => state.allRoomInfo.allRoomInfo);
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
  const roomInfo = useSelector((state: RootState) => state.roomInfo.displayInfo);
  const clusterMap = useSelector((state: RootState) => state.clusterMap.clusterMap);
  const dispatch = useDispatch();
  const { handleRoomChange, updateColorMap} = useRoomData();

  const handlePatternChange =  () => {
    
      const response = roomApi.getClusterByFloorAndDate(currentFloor, currentAttribute, currentTime);
      const clusterMap: Record<number, number> = {};
      const newClusterColor: Record<number, string> = {};
      console.log(response);
      let nCluster = 0;

      response.then((response) => {
        response.data.forEach((item: ClusterData) => {
         clusterMap[item.roomid] = item.cluster;
         if (item.roomid == currentRoomId){
          //console.log("yea");
          dispatch(setCluster(item.cluster));
         }
         nCluster = Math.max(nCluster, item.nclusters);
        });

        dispatch(setClusterMap(clusterMap));
        const colorList = generateColorByCluster(response.data);
        //console.log(colorList);
        dispatch(setAttributeColor({attribute: currentAttribute, data: colorList}));
        for(let i = 0; i < nCluster; i++){
          newClusterColor[i] = clusterColorList[i % clusterColorList.length];
        }
        dispatch(setClusterColor(newClusterColor));
        console.log(newClusterColor);
      });
      
  };

  useEffect(() => {
    let newRoomIdMap: Record<number, string> = {};
    
    // create a promise array to track all api calls
    const promises = allFloors.map(floor => 
      roomApi.getInfoByFloor(floor).then((response) => {
        dispatch(setOneRoomInfo({ floor, room: response.data }));
        
        if(floor === 1){
          updateRoomInfoAndAvailability(response.data, currentRoomId, dispatch);  
        }
        
        // collect all room info
        for (const room of response.data) {
          // use spread operator to create new object, avoid directly modifying the original object
          newRoomIdMap = { ...newRoomIdMap, [room.room_id]: room.room_name };
        }
        
        return response;
      })
    );
    
    // wait for all api calls to complete before updating roomIdMap
    Promise.all(promises).then(() => {
      dispatch(setRoomIdMap(newRoomIdMap));
    });
  }, []);

  useEffect(() => {   // DONE
    handleRoomChange();
    if(currentPattern==='pattern'){
      dispatch(setCluster(clusterMap[currentRoomId]));
    }
   
  }, [currentRoomId]);


  useEffect(() => {
    if (currentFloor === 1) {
      dispatch(setRoomId(29));
      dispatch(setClickedRoom([29]));
    } else {
      dispatch(setRoomId(133));
      dispatch(setClickedRoom([133]));
    }
    if(currentPattern == 'data'){
      
      handleRoomChange();
      updateColorMap();
    }else{
      handlePatternChange();
    }
    dispatch(setClickable(false));


  }, [currentFloor]);


  useEffect(() => {
    if (currentPattern === 'pattern') {
      handlePatternChange();

    }else{
      handleRoomChange();
      updateColorMap();
    }
  }, [currentPattern, currentAttribute, currentTime]);

  useEffect(()=>{
    //if (currentPattern === 'pattern') {
    //  handlePatternChange();
    //}
  }), [currentAttribute];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Navbar />
        <Box className='main-window'>     
          <Container className='main-window-left'>
            {currentFloor === 1 ? <Floorfirst /> : <Floorfourth />}
          </Container>

          <Container className='main-window-right'>
            
            <DetailHeader />

            <Container className='window-right-bottom'>
              {currentPattern === 'pattern' ? <Pattern /> : <Data />}
            </Container>
          </Container>
        </Box>
    </ThemeProvider>
  );
}

export default App;
