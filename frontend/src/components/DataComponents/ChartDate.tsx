import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';  
import { simpleChartStyle } from '../compentStyle';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDateProps {
  data: number[];
  loading: boolean;
}

const ChartDate: React.FC<ChartDateProps> = ({ data, loading }) => {
  //const currentRoom = useSelector((state: RootState) => state.room.currentRoom);
  //const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
  const currentTime = useSelector((state: RootState) => state.time.currentTime);
  let hours;
  if (data.length == 24) {
    hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  } else {
    hours = Array.from({ length: 48 }, (_, i) => {
      const hour = Math.floor(i/2);
      const minute = i % 2 === 0 ? '00' : '30';
      return `${hour}:${minute}`;
    });
  }
  //console.log(currentFloor);
  //console.log(hours);
  const chartData = {
    labels: hours,
    datasets: [
      {
        label: currentAttribute === 'temperature' ? 'Temperature(°C)' : currentAttribute === 'airquality' ? 'Air Quality' : currentAttribute === 'light' ? 'Light' : 'Daylight',
        data: data,
        borderColor: '#27548A',
        backgroundColor: '#183B4E',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: currentAttribute.charAt(0).toUpperCase() + currentAttribute.slice(1) + ' Change in ' + currentTime
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: currentAttribute.charAt(0).toUpperCase() + currentAttribute.slice(1)
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxTicksLimit: 12,
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0
        }
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 0 , marginTop: '10px'}}>
      <Grid container spacing={3}>
        <Paper sx={simpleChartStyle} >
          
          {loading ? (
            <Typography>Loading...</Typography>
          ) : data.length > 0 ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <Typography>No data available</Typography>
          )}
        </Paper>
      </Grid>
    </Box>
  );
};

export default ChartDate; 