import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClusterColorState {
  clusterColor: Record<number, string>;
}

const initialState: ClusterColorState = {
  clusterColor: {},
};

export const clusterColorSlice = createSlice({
  name: 'clusterColor',
  initialState,
  reducers: {
    setClusterColor: (state, action: PayloadAction<Record<number, string>>) => {
      state.clusterColor = action.payload;
    },
  },
});

export const { setClusterColor } = clusterColorSlice.actions;
export default clusterColorSlice.reducer; 