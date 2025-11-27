import { Container,FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setAttribute } from "../store/attributeSlice";import '../index.css';
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { setTime } from '../store/timeSlice';
import { useEffect } from 'react';
import { attributes } from '../types/SensorType';
import { roomApi } from "../services/api";

const DetailHeader = () => {
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
  const sensorAvailability = useSelector((state: RootState) => state.roomInfo.sensorAvailability);
  const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(dayjs('2024-03-08'));
  const [toDate, setToDate] = React.useState<Dayjs | null>(dayjs('2025-01-01'));

  const dispatch = useDispatch();
  const [date, setDate] = React.useState<Dayjs | null>(dayjs('2024-04-17'));

  useEffect(() => {
    dispatch(setTime(date?.format('YYYY-MM-DD') || ''));
  }, [date]);

  useEffect(() => {
    roomApi.getDateRangeByRoomId(currentRoomId).then((response) => {
      setFromDate(dayjs(response.data[0].time_start));
      setToDate(dayjs(response.data[0].time_end));
    });
  }, [currentRoomId]);

  const handleAttributeChange = (event: any) => {
    dispatch(setAttribute(event.target.value as 'temperature' | 'airquality' | 'daylight' | 'light'));
  };

    return ( 
      <Container className='window-right-top' sx={{
        width:'540px',
        marginLeft: '100px'
      }}>
        <Container sx={{
          //width: '50%',
          marginRight: '-50px',
          marginTop: '10px',
          display: 'flex',
          //border: '1px solid #ACD3A8',
          }}>
          <FormControl sx={{ m: 1, height: '65px', width: '200px' }} >
            <InputLabel id="demo-select-small-label" sx={{
              background:'none'
            }}>
              Select Attribute
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={currentAttribute}
              label="Select Attribute"
              onChange={handleAttributeChange}
              sx={{
                backgroundColor: 'none'
              }}
            >
              {attributes.map((attribute) => (
                <MenuItem key={attribute} value={attribute} sx={{
                  backgroundColor: 'none',
                  cursor: sensorAvailability[attribute] ? 'pointer' : 'not-allowed',
                  opacity: sensorAvailability[attribute] ? 1 : 0.5,
                }}
                
                >{attribute}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Container>
        <Container sx={{
          //width: '50%', 
          //border: '1px solid #ACD3A8',
          marginTop: '10px',
          marginLeft: '0px',
          display: 'flex',
        }}>
        
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker', 'DatePicker']} sx={{height: '65px', width: '200px'}}>
          <DatePicker
            label="Choose Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            minDate={fromDate}
            maxDate={toDate}
          />
          </DemoContainer>
        
          </LocalizationProvider>
        </Container>
    </Container>          

    )
}

export default DetailHeader;