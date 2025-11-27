import floorplan from '../assets/plattegronden_TO-5.svg';
import './Floorfirst.css';
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setRoomId } from '../store/roomIdSlice';
import { setCluster } from '../store/clusterSlice';
import { useRoomData } from '../hooks/useRoomData';



const Floorfourth = () => {
    //const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
    const allRoomInfo = useSelector((state: RootState) => state.allRoomInfo.allRoomInfo);
    const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
    const floorColor = useSelector((state: RootState) => state.floorColor[currentAttribute]);
    
    const roomIdMap = useSelector((state: RootState) => state.roomIdMap.roomIdMap);
    const currentPattern = useSelector((state: RootState) => state.pattern.currentPattern);
    const clusterColor = useSelector((state: RootState) => state.clusterColor.clusterColor);
    const { handleRoomClick } = useRoomData();


    //const [allRoomInfo, setAllRoomInfo] = useState<Room[]>([]);
    const floorRooms = allRoomInfo[4] || [];

/*
    const handleRoomClick = (roomId: number) => {
      dispatch(setRoomId(roomId));
      console.log(`clicked room: ${roomId}`);
      if(currentPattern === 'pattern'){
        dispatch(setCluster(clusterMap[roomId]));
      }
    };
    */
/*
    useEffect(() => {
      roomApi.getInfoByFloor(currentFloor).then(response => {
        setAllRoomInfo(response.data);
        setRoom(133);
        //const currentRoom = 133;
        updateRoomInfoAndAvailability(response.data, 133, dispatch);

      });
    }, []);
  
 */   

  return (

      <div className='floor-container'>
        <div className='floor-background'>
          <img src={floorplan} alt="Floorplan" style={{ width: '900px', height: '842px' }} />
        </div>
        <div className='floor-content'>
        <Box >
        <div style={{position: 'absolute', top: 30, right: 40}}>
          {/*
        <Typography variant="h6" color="primary">
          Clicked:{clickable ? 'multiple' : 'single'} {clickedRoom.map((roomId) => roomIdMap[roomId]).join(', ')}
        </Typography>
        */}
        {currentPattern === 'pattern' ? 
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" color="primary">Cluster Color:</Typography>
            {Object.entries(clusterColor).map(([index, color]) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" color="black">
                  {index}
                </Typography>
                <Box
                  sx={{
                    width: 30,
                    height: 14,
                    backgroundColor: color,
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    opacity: 0.7
                  }}
                />
              </Box>
            ))}
          </Box>
          : ''}
        </div>
        <Box>
        {floorRooms.map((room) => (
          <Box
            key={room.room_id}
            onClick={() => handleRoomClick(room.room_id)}
            sx={{
              position: 'absolute',
              left: room.x+61,
              top: room.y+61,
              width: room.width,
              height: room.height,
              bgcolor: floorColor[room.room_id],
              opacity: 0.45,
              border: currentRoomId === room.room_id ? '4px solid yellow' : '1px solid grey',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                opacity: 0.25,
                transform: 'scale(1.02)'
              }
            }}
          >
            <Typography variant="body1" color="black">
              {room.room_name}
            </Typography>
            </Box>
          
        ))}
    </Box>
    </Box>
        </div>
      </div>
  );
};

export default Floorfourth;