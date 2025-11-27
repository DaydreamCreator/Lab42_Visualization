

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setTime } from '../store/timeSlice';
import { useEffect } from 'react';

export default function Timepicker(props: {label: string}) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2024-04-17'));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTime(value?.format('YYYY-MM-DD') || ''));
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']} sx={{height: '70px', width: '200px'}}>
        <DatePicker
          label={props.label}
          value={value}
          onChange={(newValue) => setValue(newValue)
          }
        />
      </DemoContainer>
      
    </LocalizationProvider>
  );
}