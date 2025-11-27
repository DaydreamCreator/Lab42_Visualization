import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';  
import { simpleChartStyle } from '../compentStyle';
import { clusterColorList } from '../../utils/colorUtils';
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
  clickedCluster: number[];
  mode: string;
}

const TrendChart: React.FC<ChartDateProps> = ({ data,  clickedCluster, mode }) => {
  const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
  const hours = Array.from({ length: 24 }, (_, i) => `${i}`);
  //  let hours;
    
  const generateDatasets = () => {
   
    const datasets = [];

    if (mode === 'single') {
      
      datasets.push({
        label: currentAttribute + ' variance',
        data: Object.values(data)[0],
        borderColor: clusterColorList[clickedCluster[0]],
        backgroundColor: clusterColorList[clickedCluster[0]],
        tension: 0.4
      });
    } else if (mode === 'multiple') {
      // multiple data lines
      Object.entries(data).forEach(([key, values], index) => {
        if (clickedCluster.includes(parseInt(key))) {
          datasets.push({
            label: `Cluster ${parseInt(key)}`,
            data: values,
            borderColor: clusterColorList[index % clusterColorList.length],
            backgroundColor: clusterColorList[index % clusterColorList.length],
            tension: 0.4
          });
        }
      });
    }

    return datasets;
  };

  const chartData = {
    labels: hours,
    datasets: generateDatasets()
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: currentAttribute + ' Change in 24 Hours'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: false,
          text: currentAttribute
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  const hasData = Object.values(data).some(values => values.length > 0);

  return (
    <Box sx={{ flexGrow: 1, p: 0, marginTop: '20px' }}>
      <Grid container spacing={3}>
        <Paper sx={simpleChartStyle}>
          {hasData ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <Typography>No data available</Typography>
          )}
        </Paper>
      </Grid>
    </Box>
  );
};

export default TrendChart; 