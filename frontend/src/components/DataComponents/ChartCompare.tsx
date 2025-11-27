import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';  
import dayjs from 'dayjs';

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
  data: Record<number, number[]>;
  loading: boolean;
  fromDate: string;
  toDate: string;
}

const ChartCompare: React.FC<ChartDateProps> = ({ data, loading, fromDate, toDate }) => {
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);

  // compute the total hours between fromDate and toDate
  const startDate = dayjs(fromDate);
  const endDate = dayjs(toDate);
  const daysDiff = endDate.diff(startDate, 'day');
  const totalHours = (daysDiff + 1) * 24;
  console.log(totalHours);
  
  // prepare the data set
  const datasets = Object.entries(data).map(([roomId, values], index) => {
    console.log(`Room ${roomId} - Original values length:`, values.length);
    console.log('Total hours:', totalHours);
    
    const adjustedValues = values.length < totalHours 
      ? [...values, ...Array(totalHours - values.length).fill(null)]
      : values.slice(0, totalHours);
      
    console.log(`Room ${roomId} - Adjusted values length:`, adjustedValues.length);
    
    return {
      label: `Room ${roomId}`,
      data: adjustedValues,
      borderColor: `hsl(${index * 360 / Object.keys(data).length}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 360 / Object.keys(data).length}, 70%, 50%, 0.5)`,
      tension: 0.3,
      spanGaps: true, // allow drawing lines between data points
      pointRadius: 0, // hide data points
      pointHoverRadius: 0 // hide points when hovering
    };
  });

  const timePoints = Array.from({ length: totalHours }, (_, i) => {
    const currentDate = startDate.add(i, 'hour');
    return currentDate.format('MM-DD HH:00');
  });

  const chartData = {
    labels: timePoints,
    datasets: datasets
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,     //TODO
        text: `${currentAttribute} Change from ${fromDate} to ${toDate}`
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: currentAttribute
        },
        
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        },
       
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 0, marginTop: '20px' }}>
      <Grid container spacing={3}>
        <Paper sx={{ width:'490px', height:'300px', padding: '8px' }} >
          {loading ? (
            <Typography>Loading...</Typography>
          ) : Object.keys(data).length > 0 ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <Typography>No data available</Typography>
          )}
        </Paper>
      </Grid>
    </Box>
  );
};

export default ChartCompare; 