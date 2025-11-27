import { Box, Typography, ButtonGroup, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import floorplan from '../assets/plattegronden_TO-2.svg';
import './Floorfirst.css';
import { setCluster } from '../store/clusterSlice';
import { useRoomData } from '../hooks/useRoomData';



const Floorfirst = () => {
  
  const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
  const clickable = useSelector((state: RootState) => state.multipleClick.clickable);
  const clickedRoom = useSelector((state: RootState) => state.multipleClick.clickedRoom);
  const clusterColor = useSelector((state: RootState) => state.clusterColor.clusterColor);


  const allRoomInfo = useSelector((state: RootState) => state.allRoomInfo.allRoomInfo);
  const dispatch = useDispatch();
  const roomIdMap = useSelector((state: RootState) => state.roomIdMap.roomIdMap);
  const floorColor = useSelector((state: RootState) => state.floorColor[currentAttribute]);

  const floorRooms = allRoomInfo[1] || [];
  const currentPattern = useSelector((state: RootState) => state.pattern.currentPattern);
  const { handleRoomClick } = useRoomData();


  const [allColors, setAllColors] = useState<Record<number, string>>({});
  

  return (
    <div className='floor-container'>
      
      <div className='floor-background' style={{top:5}}>
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
              left: room.x+80,
              top: room.y+72,
              width: room.width,
              height: room.height,
              bgcolor: floorColor[room.room_id],
              opacity: 0.45,
              border: currentRoomId === room.room_id ? '4px solid yellow' : '1px solid grey',    // TODO
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
            <Typography variant="h6" color="black">
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

export default Floorfirst;