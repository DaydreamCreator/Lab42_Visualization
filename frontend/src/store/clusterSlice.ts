import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClusterState {
  cluster: number;
}

const initialState: ClusterState = {
  cluster: 0,
};

export const clusterSlice = createSlice({
  name: 'cluster',
  initialState,
  reducers: {
    setCluster: (state, action: PayloadAction<number>) => {
      state.cluster = action.payload;
    },
  },
});

export const { setCluster } = clusterSlice.actions;
export default clusterSlice.reducer; 