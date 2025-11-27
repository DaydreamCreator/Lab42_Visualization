import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Chart from "./ChartDate";
import { setAttribute } from "../../store/attributeSlice";
import { useDispatch } from "react-redux";
import ThermostatSharpIcon from '@mui/icons-material/ThermostatSharp';
import WbIncandescentSharpIcon from '@mui/icons-material/WbIncandescentSharp';
import WbSunnySharpIcon from '@mui/icons-material/WbSunnySharp';
import WindPowerSharpIcon from '@mui/icons-material/WindPowerSharp';
import { cardStyle } from '../compentStyle';
import { roomApi } from "../../services/api";
import { useEffect, useState } from "react";

type AttributeType = 'temperature' | 'airquality' | 'light' | 'daylight';

const attributes = ['temperature', 'airquality', 'light', 'daylight'];

export default function Roomdetails() {
    const dispatch = useDispatch();
    const currentAttribute = useSelector((state: RootState) => state.attribute.currentAttribute);
    const currentRoomId = useSelector((state: RootState) => state.room.currentRoomId);
    const currentTime = useSelector((state: RootState) => state.time.currentTime);
    const currentRoomInfo = useSelector((state: RootState) => state.roomInfo.displayInfo);
    const sensorAvailability = useSelector((state: RootState) => state.roomInfo.sensorAvailability);
    const average = useSelector((state: RootState) => state.attributeMap.attributes);
    const chartDict = useSelector((state: RootState) => state.chartData);
    const currentFloor = useSelector((state: RootState) => state.floor.currentFloor);
    const [analysisResult, setAnalysisResult] = useState<string>("Loading...");
    //console.log(chartDict[currentAttribute as keyof typeof chartDict]);
    // TODO
    const getAnalysisResult = () => {
        if (chartDict.isLoading[currentAttribute]) {
            roomApi.postAnalysisResult(0, currentFloor, currentRoomId, 0, chartDict[currentAttribute], currentAttribute, `${currentTime}`).then((response) => {
                setAnalysisResult(response.data);
            });
        }
    }
    useEffect(() => {
        getAnalysisResult();
    }, [currentRoomId, currentFloor, currentTime, currentAttribute]);
    
    //const { loading, fetchData } = useRoomData();
    const loading = chartDict[currentAttribute as keyof typeof chartDict] ? false : true;

    const icons: Record<AttributeType, React.ReactNode> = {
        temperature: <ThermostatSharpIcon fontSize="large"/>,
        airquality: <WindPowerSharpIcon fontSize="large"/>,
        light: <WbIncandescentSharpIcon fontSize="large"/>,
        daylight: <WbSunnySharpIcon fontSize="large"/>
    };
    
    

    return (
    <Card sx={cardStyle}>
        <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            Room {currentRoomInfo.roomId}, area {currentRoomInfo.roomArea} m<sup>2</sup>
        </Typography>
        <Typography variant="h5" component="div">
            {currentRoomInfo.roomName} - {currentRoomInfo.roomType.charAt(0).toUpperCase() + currentRoomInfo.roomType.slice(1)}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}></Typography>
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        
        {attributes.map((attribute) => (
            <Container 
                key={attribute}
                sx={{
                    border: 'none', 
                    borderRadius: '5px', 
                    padding: '0px', 
                    width: '24%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100px',
                    cursor: sensorAvailability[attribute as keyof typeof sensorAvailability] ? 'pointer' : 'not-allowed',
                    opacity: sensorAvailability[attribute as keyof typeof sensorAvailability] ? 1 : 0.5,
                    backgroundColor: currentAttribute === attribute ? '#27548A' : 'inherit',
                    color: currentAttribute === attribute ? 'white' : 'inherit',
                    ":hover":{
                        border: '1px solid #547792',
                        background: 'rgba(39, 84, 138, 0.2)'
                    }
                   
                    
                }}
                onClick={() => {
                    if (sensorAvailability[attribute as keyof typeof sensorAvailability]) {
                        dispatch(setAttribute(attribute as 'temperature' | 'airquality' | 'light' | 'daylight'));
                    }
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center'}}>{icons[attribute as keyof typeof icons]}</Box>
                <Typography variant="body1" component="p">
                {average[attribute as keyof typeof average].toFixed(1)} {attribute === 'temperature' ? '°C': '' }
                </Typography>
                <Typography  gutterBottom sx={{fontFamily: 'Cursive', fontWeight: 'bold',mb: 1}}>
                    {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                </Typography>
                
            </Container>
        ))}
         </Box>
         <Chart data={chartDict[currentAttribute]} loading={loading} />
        <Typography variant="body2">
        {analysisResult}
        </Typography>

    </CardContent>
    </Card>
)}
