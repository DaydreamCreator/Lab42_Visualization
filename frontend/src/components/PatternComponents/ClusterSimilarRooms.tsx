
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useEffect, useState } from 'react';
import { roomApi } from '../../services/api';
import { Card, CardContent, Typography } from '@mui/material';
import { cardStyle } from '../compentStyle';

export default function ClusterSimilarRooms() {
    const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
    const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
    const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
    const [clusterDistribution, setClusterDistribution] = useState<number[]>([]);

    //const clusterDistribution = useSelector((state: RootState) => state.clusterDistribution.clusterDistribution);
    const fetchClusterDistribution = () => {
        roomApi.getClusterDistributionByAttribute(currentAttribute, currentFloor, currentRoomId).then((response) => {
            //console.log(response.data[0].distribution);
            setClusterDistribution(response.data[0].distribution);
        });
    }

    useEffect(() => {
        fetchClusterDistribution();
    }, [currentAttribute, currentFloor, currentRoomId]);

    return (
        <Card sx={cardStyle}>
            <CardContent>
            <div>
                <Typography variant="h6">Cluster Distribution of {currentAttribute} on floor {currentFloor} for room {currentRoomId}</Typography>
                {clusterDistribution.map((item, index) => (
                    <Typography variant="body1" key={index}>Cluster {index} : {item}%</Typography>
                ))}

            </div>
            </CardContent>
        </Card>
    )
}