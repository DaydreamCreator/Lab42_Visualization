import { AppBar, Toolbar, Typography, Box, Tab, Tabs } from '@mui/material';
//import { Link as RouterLink } from 'react-router-dom';
//import Dropdown from './Dropdown';

import { setPattern } from '../store/patternSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
//import { useEffect, useState } from 'react';
import * as React from 'react';
import { setFloor } from '../store/floorSlice';

// https://mui.com/material-ui/react-tabs/

function a11yProps(index: string) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type Floor = 1 | 2 | 3 | 4;
type Pattern = 'data' | 'pattern';

const Navbar = () => {
  const dispatch = useDispatch();
  //const [floor] = useState<Floor>('first');
  
  const currentPattern = useSelector((state: RootState) => state.pattern.currentPattern);
  const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
  //const currentFloor = useSelector(
  // (state: RootState) => state.floor.currentFloor);
  
  const handleChangeFloor = (event: React.SyntheticEvent, floor: Floor) => {
    dispatch(setFloor(floor));
  };

  const handleChangePattern = (event: React.SyntheticEvent, pattern: Pattern) => {
    dispatch(setPattern(pattern));
  };

  // #3E3F5B
 const tabStyle = {
  fontSize: '16px',
  //fontWeight: 'bold'
 }

  return (
    <AppBar position="static" sx={{bgcolor: '#183B4E'}}>
      <Toolbar>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LAB42
        </Typography>
        <Box sx={{ width: '46%'}}>
          <Box  sx={{/*marginLeft:'20px'*/}}>
            <Tabs value={currentFloor}  textColor="inherit"  indicatorColor="secondary"  aria-label="basic tabs example" onChange={handleChangeFloor} >
              <Tab label="First Floor" {...a11yProps('first')} value={1} sx={tabStyle} />
              <Tab label="Fourth Floor" {...a11yProps('fourth')} value={4} sx={tabStyle} />
            </Tabs>
          </Box>
        
        </Box>

        <Box sx={{ width: '18%'}}>
          <Box >
            <Tabs value={currentPattern}  textColor="inherit"  indicatorColor="secondary"  aria-label="secondary tabs example"  onChange={handleChangePattern} >
              <Tab label="DATA" {...a11yProps('data')} value='data' sx={tabStyle} />
              <Tab label="PATTERN" {...a11yProps('pattern')} value='pattern' sx={tabStyle} />
            </Tabs>
          </Box>
        
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 