import { List } from "@mui/material";

// the data type of the cluster
export interface ClusterData {
    id: string;
    cluster: number;
    roomid: number;
    floor: number;
    date: string;
    nclusters: number;
    attribute: string;
}

export interface ClusterTrendsData {
    id: string;
    attribute: string;
    floor: number;
    cluster: number;
    time_slot: number;
    mean_ts: number;
    std_ts: number;
}


export interface ClusterDistributionData {
    id: string;
    attribute: string;
    floor: number;
    roomid: number;
    nclusters: number;
    distribution: number[];
}