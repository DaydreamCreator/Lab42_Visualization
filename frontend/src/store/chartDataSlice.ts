import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChartDataState {
    temperature: number[];
    airquality: number[];
    light: number[];
    daylight: number[];
    isLoading: {
      temperature: boolean;
      airquality: boolean;
      light: boolean;
      daylight: boolean;
    };
}

const initialState: ChartDataState = {
    temperature: [],
    airquality: [],
    light: [],
    daylight: [],
    isLoading: {
      temperature: false,
      airquality: false,
      light: false,
      daylight: false,
    }
};

export const chartDataSlice = createSlice({
  name: 'chartData',
  initialState,
  reducers: {
    setAttributeChartData: (state, action: PayloadAction<{ attribute: string, data: number[] }>) => {
      if (action.payload.attribute === 'temperature') {
        state.temperature = action.payload.data;
        state.isLoading.temperature = true;
      } else if (action.payload.attribute === 'airquality') {
        state.airquality = action.payload.data;
        state.isLoading.airquality = true;
      } else if (action.payload.attribute === 'light') {
        state.light = action.payload.data;
        state.isLoading.light = true;
      } else if (action.payload.attribute === 'daylight') {
        state.daylight = action.payload.data;
        state.isLoading.daylight = true;
      }
    },
  },
});

export const { setAttributeChartData } = chartDataSlice.actions;
export default chartDataSlice.reducer; 