//import Timepicker from "../Timepicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Typography, Stack, Card, CardContent, Grid } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel, FormControl, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import '../../index.css';
import dayjs, { Dayjs } from 'dayjs';
import ChartCompare from "./ChartCompare";
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { roomApi } from '../../services/api';
import { RoomData } from '../../types/RoomType';
import { setClickable } from '../../store/multipleClickSlice';
import { useDispatch } from 'react-redux';
import { attributes, SensorData } from '../../types/SensorType';
import { cardStyle, selectTitleStyle } from '../compentStyle';
//type attributes = 'Temperature' | 'Air Quality' | 'Light' | 'Daylight';


const CompareData = () => {

  const [isClicked, setIsClicked] = useState<Array<Boolean>>([false, false, false, false]);
  const [clickedAttributeIndex, setClickedAttributeIndex] = useState<number>(0);
  const [compareType, setCompareType] = useState<string>('same');
  const attributesDisplay = ['Temperature', 'Air Quality', 'Light', 'Daylight'];
  const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
  const currentTime = useSelector((state: RootState) => state.time.currentTime);
  const [otherRoomId, setOtherRoomId] = useState<number>(0);   //TODO
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs(currentTime));
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs(currentTime));
  const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
  const clickedRoom = useSelector((state: RootState) => state.multipleClick.clickedRoom);
  const [selectedAttribute, setSelectedAttribute] = useState<string>('Temperature');
  const [compareData, setCompareData] = useState<Record<number, Record<string, number[]>>>({});
  // fetch the data of comparison type

  

  //const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const dispatch = useDispatch();

  const handleClick = (index: number) => {
    setClickedAttributeIndex(index);
  }
  /*
  const handleClick = (index: number) => {
    setIsClicked((prev) => {
      const newClicked = [...prev];
      newClicked[index] = !newClicked[index];
      if (newClicked[index]) {
        // TODO: request data from backend
        console.log('request data from backend');
        
      }
      return newClicked;
    });
    
    
  };
  */
  const StyledButton = styled(Button)(({ theme }) => ({
    '&:hover': {
      backgroundColor: '#547792',
    },
  }));
  const assignAttributeData = (roomData: RoomData[]) => {
    const allSensorData: Record<number, Record<string, number[]>> = {};

    for (const room of roomData) {
      if (!allSensorData[room.roomid]) {
        allSensorData[room.roomid] = {};
      }
      for (const attribute of attributes) {
        if (!allSensorData[room.roomid][attribute]) {
          allSensorData[room.roomid][attribute] = [];
        }
        const values = room.sensor_data.map((item: { temperature: number; airquality: number; daylight: number; light: number; }) => {
          const value = item[attribute];
          return value === null ? 0 : value;
        });
        allSensorData[room.roomid][attribute].push(...values);
      }
    }
    setCompareData(allSensorData);
  }
  useEffect(() => {
    if(compareType == "same"){
      roomApi.getRoomDataByTimeRange(
        currentRoomId, 
        fromDate?.format('YYYY-MM-DD') || '', 
        toDate?.format('YYYY-MM-DD') || '', 
        currentFloor
      ).then((response) => {
        console.log('Response data:', response.data);
        
        assignAttributeData(response.data);
      });
    } else {
      console.log('Clicked rooms:', clickedRoom);
      roomApi.getMultipleRoomsDataByTimeRange(
        clickedRoom, 
        fromDate?.format('YYYY-MM-DD') || '', 
        toDate?.format('YYYY-MM-DD') || '', 
        currentFloor
      ).then((response) => {
        console.log('Response data:', response.data);
        assignAttributeData(response.data);
      });
    }
  }, [fromDate, toDate, currentRoomId, compareType, clickedRoom]);

  useEffect(() => {
    if (compareType == "diff"){
      dispatch(setClickable(true));
      console.log('set clickable to true');
    }
    else{
      dispatch(setClickable(false));
      console.log('set clickable to false');
    }
  }, [compareType]);

  

  return (
    <Card sx={cardStyle}>
      <CardContent>
       
      <div className="select-container">
        <Typography variant="h6" component="div" sx={selectTitleStyle}>
            SELECT COMPARISON TYPE
        </Typography>

             <Grid container spacing={5}>
                <Grid size={12}>
                <FormControl>
                <RadioGroup
                    row
                    defaultValue="same"
                    name="radio-buttons-group"
                    onChange={(e) => setCompareType(e.target.value)}
                >
                <FormControlLabel value="same" control={<Radio />} label="Same Room" sx={{width:'180px'}}/>
                <FormControlLabel value="diff" control={<Radio />} label="Others" sx={{width:'100px', marginLeft:'50px'}}/>
                </RadioGroup>
                </FormControl>
                
                </Grid>

            </Grid>
       
        </div>
        <div className="select-container">
            <Typography variant="h6" component="div" sx={selectTitleStyle}>
                SELECT TIME RANGE
            </Typography>
            <Grid container spacing={1}>
              <Grid size={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']} sx={{height: '65px', width: '200px'}}>
                  <DatePicker
                    label="From"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                  />
                </DemoContainer>
                
                </LocalizationProvider>
              </Grid>

              <Grid size={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']} sx={{height: '65px', width: '200px'}}>
                  <DatePicker
                    label="To"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
                </Grid>
            </Grid>
             
        </div>
        <div className="select-container">
            <Typography variant="h6" component="div" sx={selectTitleStyle}>
                SELECT ATTRIBUTES
            </Typography>
            
                <Stack direction="row" spacing={2}>
               {attributesDisplay.map((attribute, index) => (
                <StyledButton
                    key={attribute}
                    variant="contained"
                    color="primary"
                    onClick={() => handleClick(index)}
                    sx={{
                        backgroundColor: clickedAttributeIndex === index ? 'primary.main' : 'inherit',
                        color: clickedAttributeIndex === index ? 'white' : 'inherit',
                        fontSize: '12px',
                    }}
                >
                    {attribute}
                </StyledButton>
               ))}
                </Stack>
                
        </div>
        <ChartCompare 
          data={Object.fromEntries(
            Object.entries(compareData).map(([roomId, data]) => [
              roomId,
              data[attributes[clickedAttributeIndex]]
            ])
          )} 
          loading={false} 
          fromDate={fromDate?.format('YYYY-MM-DD') || ''} 
          toDate={toDate?.format('YYYY-MM-DD') || ''} 
        />
    </CardContent>
    </Card>
  );
};

export default CompareData;