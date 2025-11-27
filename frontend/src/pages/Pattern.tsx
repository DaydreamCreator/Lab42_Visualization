
import {  Box, Tab, Container } from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import * as React from 'react';
import ClusterDetails from "../components/PatternComponents/ClusterDetails";
import CompareCluster from "../components/PatternComponents/CompareCluster";
import {  useSelector} from 'react-redux';
import { RootState } from '../store';
import { ClusterTrendsData } from '../types/ClusterType';
import ClusterSimilarRooms from "../components/PatternComponents/ClusterSimilarRooms";
import { roomApi } from '../services/api';
import { useEffect } from 'react';


const Pattern = () => {
  //const dispatch = useDispatch();
  // set the default subpattern to clusterDetails
  //dispatch(setSubPattern('clusterDetails'));
  const [value, setValue] = React.useState('1');
  const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
  //const clusterMap = useSelector((state: RootState) => state.clusterMap.clusterMap);
  //const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
  const currentPattern = useSelector((state: RootState) => state.pattern.currentPattern);
  const currentCluster = useSelector((state: RootState) => state.cluster.cluster);
  const currentDate = useSelector((state: RootState) => state.time.currentTime);
  const [clusterNumber, setClusterNumber] = React.useState<number>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [clusterTrends, setClusterTrends] = React.useState<ClusterTrendsData[]>([]);

  const handleClusterChange = () => {  // TODO
    roomApi.getClusterTrendsByAttribute(currentAttribute, currentFloor, currentCluster).then((response) => {
      console.log(response.data);
      setClusterTrends(response.data);
    });
  }

  useEffect(() => {
    if(currentPattern === 'pattern'){
      handleClusterChange();
    }
  }, [currentPattern, currentCluster]);


  useEffect(() => {
    if(value === '2'){
      roomApi.getClusterNumber(currentFloor, currentDate, currentAttribute).then((response) => {
        setClusterNumber(response.data);
        console.log(clusterNumber);
      });
    }
  }, [value, currentFloor, currentDate, currentAttribute]);

  const tabStyle = {
    fontSize: '15px',
    width: '180px'
  }
  return (
    <Box >
      <Container sx={{  width: '90%', marginLeft: '-10px'}}>  
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="basic tabs example" sx={{width:'540px'}}>
            <Tab label="Cluster Details" value="1" sx={tabStyle} />
            <Tab label="Compare" value="2" sx={tabStyle} />
            <Tab label="Similar Rooms" value="3" sx={tabStyle} />
          </TabList>
        </Box>
        <TabPanel value="1"><ClusterDetails clusterTrends={clusterTrends} /></TabPanel>
        <TabPanel value="2"><CompareCluster clusterNumber={clusterNumber} /></TabPanel>
        <TabPanel value="3"><ClusterSimilarRooms /></TabPanel>
      </TabContext>
      </Container>

      </Box>
    
  );
};

export default Pattern;