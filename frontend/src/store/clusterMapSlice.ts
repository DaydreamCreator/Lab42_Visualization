import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClusterMapState {
  clusterMap: Record<number, number>;
}

const initialState: ClusterMapState = {
  clusterMap: {},
};

export const clusterMapSlice = createSlice({
  name: 'clusterMap',
  initialState,
  reducers: {
    setClusterMap: (state, action: PayloadAction<Record<number, number>>) => {
      state.clusterMap = action.payload;
    },
  },
});

export const { setClusterMap } = clusterMapSlice.actions;
export default clusterMapSlice.reducer; 