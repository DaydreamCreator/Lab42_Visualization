import { Typography, Card, CardContent } from "@mui/material";
import { ClusterTrendsData } from "../../types/ClusterType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import TrendChart from "./TrendChart";
import { roomApi } from "../../services/api";
import { useState, useEffect } from "react";
import { cardStyle } from "../compentStyle";

const ClusterDetails = ({clusterTrends}: {clusterTrends: ClusterTrendsData[]}) => {
    const cluster = useSelector((state: RootState) => state.cluster.cluster);
    const [similarRooms, setSimilarRooms] = useState<Record<string, number[]>>({});
    const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
    const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
    const currentTime = useSelector((state: RootState) => state.time.currentTime);
    const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
    const roomIdMap = useSelector((state: RootState) => state.roomIdMap.roomIdMap);
    const dataForTrendChart = {cluster: clusterTrends.map((trend) => trend.mean_ts)};
    const [analysisResult, setAnalysisResult] = useState<string>("Loading...");
    //console.log(chartDict[currentAttribute as keyof typeof chartDict]);
    // TODO
    const getAnalysisResult = () => {
        if (dataForTrendChart.cluster.length > 0) {
            roomApi.postAnalysisResult(1, currentFloor, currentRoomId, cluster, dataForTrendChart.cluster, currentAttribute, `${currentTime}`).then((response) => {
                setAnalysisResult(response.data);
            });
        }
    }
    const getSimilarRooms = () => {
        roomApi.getSimilarRoomsByRoomId(currentFloor, currentRoomId,  `${currentTime}`).then((response) => {
            setSimilarRooms(response.data);
            //console.log(response.data);
        })
        //console.log(similarRooms);
    }
    useEffect(() => {
        getSimilarRooms();
        getAnalysisResult();
    }, [currentRoomId, currentFloor, currentTime]);

    useEffect(() => {
        getAnalysisResult();
    }, [currentAttribute]);



    return (
        <Card sx={cardStyle}>
        <CardContent>
         
        <div className="select-container">
          <Typography variant="h6" component="div" sx={{fontWeight:'bold',marginBottom:'10px'}}>
              CLUSTER {cluster} DETAILS
          </Typography>
  
              <Typography variant="body2">Room {roomIdMap[currentRoomId]} is classified into cluster {cluster}, with&nbsp;
                {similarRooms[currentAttribute] && similarRooms[currentAttribute].length > 0 ? (
                  <>
                    similar rooms: {similarRooms[currentAttribute].map((roomId) => roomIdMap[roomId]).join(', ')}
                  </>
                ) : (
                  <>
                    no similar rooms
                  </>
                )}
                &nbsp;in the {currentAttribute} attribute.
              </Typography>
         
          </div>
          <div className="select-container">
              <Typography variant="h6" component="div" sx={{fontWeight:'bold',marginBottom:'10px'}}>
                  CLUSTER TREND
              </Typography>
              <TrendChart data={dataForTrendChart} clickedCluster={[cluster]} mode="single"/>
                
          </div>
          <div className="select-container">
              <Typography variant="h6" component="div" sx={{fontWeight:'bold',marginBottom:'10px'}}>
                  TREND DESCRIPTIONS
              </Typography>
              <Typography variant="body2">
                {analysisResult}
              </Typography>
                  
          </div>
      </CardContent>
      </Card>
    );
}

export default ClusterDetails;