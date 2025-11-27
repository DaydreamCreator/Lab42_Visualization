import { Stack, styled, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, FormControl, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";
import TrendChart from "./TrendChart";
import { roomApi } from "../../services/api";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { ClusterTrendsData } from "../../types/ClusterType";
import { cardStyle, selectTitleStyle } from "../compentStyle";

const CompareCluster = (props: {clusterNumber: number}) => {
  
    const [allClusterTrends, setAllClusterTrends] = useState<Record<number, number[]>>({});

    const clusters = Array.from({ length: props.clusterNumber }, (_, i) => `Cluster ${i }`);
    const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
    const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
    const clusterColor = useSelector((state: RootState) => state.clusterColor.clusterColor);
    const [clickedCluster, setClickedCluster] = useState<number[]>([0]);

    const [isClicked, setIsClicked] = useState<Array<Boolean>>([true, false, false]);
    const StyledButton = styled(Button)(({ theme }) => ({
        '&:hover': {
          backgroundColor: '#7468c2',
        },
      }));

    const handleClick = (index: number) => {
        const newIsClicked = [...isClicked];
        newIsClicked[index] = !newIsClicked[index];
        setIsClicked(newIsClicked);
        console.log(newIsClicked);
        if (newIsClicked[index]) {
            setClickedCluster([...clickedCluster, index]);
        } else {
            setClickedCluster(clickedCluster.filter(i => i !== index));
        }
        console.log(clickedCluster);
    };
    const fetchClusterTrends =  () => {
      for (let i = 0; i < props.clusterNumber; i++) {
          roomApi.getClusterTrendsByAttribute(currentAttribute, currentFloor, i).then((response) => {
              const mean_ts = response.data.map((trend: ClusterTrendsData) => trend.mean_ts);
              //console.log(mean_ts);
              setAllClusterTrends((prev) => ({ ...prev, [i]: mean_ts }));
          });
      }
      console.log(allClusterTrends);
    };

    useEffect(() => {

        fetchClusterTrends();
    }, [props.clusterNumber, currentFloor, currentAttribute]);


    return (
        <Card sx={cardStyle}>
        <CardContent>
          <div>
          <Typography variant="h6" component="div" sx={selectTitleStyle}>
            CLUSTER COMPARISON
          </Typography>
  
          <Typography variant="body2">
            Select the cluster you want to compare with
          </Typography>   
         
          </div>
          <div>
              <Typography variant="h6" component="div" sx={selectTitleStyle}>
                  SELECT CLUSTER
              </Typography>
              
                  <Stack direction="row" spacing={2}>
                 {clusters.map((cluster, index) => (
                  <StyledButton
                      key={cluster}
                      variant="contained"
                      color="primary"
                      onClick={() => handleClick(index)}
                      sx={{
                          backgroundColor: clusterColor[index],
                          //color: isClicked[index] ? 'white' : 'inherit',
                          fontSize: '12px',
                          border: isClicked[index] ? '2px solid black' : 'none',
                          //opacity: isClicked[index] ? 1 : 0.6
                      }}
                  >
                      {cluster}
                  </StyledButton>
                 ))}
                  </Stack>
                  
          </div>
          <TrendChart data={allClusterTrends} clickedCluster={clickedCluster} mode="multiple"/>
      </CardContent>
      </Card>
    );
}

export default CompareCluster;