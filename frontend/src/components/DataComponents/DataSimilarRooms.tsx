import { Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { cardStyle } from '../compentStyle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GroupedRooms, groupRoomsByAttributes, getFinalRoomList } from '../../utils/findSimilarRooms';


export default function DataSimilarRooms(props: {similarRooms: Record<string, number[]>, roomId: number}) {
    const roomIdMap = useSelector((state: RootState) => state.roomIdMap.roomIdMap);
    const [intersections, setIntersections] = useState<GroupedRooms>({
        fourAttributes: [],
        threeAttributes: [],
        twoAttributes: [],
        oneAttribute: [],
        noAttributes: []
    });
    const [finalRoomList, setFinalRoomList] = useState<number[]>([]);

    useEffect(() => {
        const grouped = groupRoomsByAttributes(props.similarRooms);
        setIntersections(grouped);
        const finalList = getFinalRoomList(props.similarRooms);
        setFinalRoomList(finalList);
    }, [props.similarRooms]);

    
    //const intersections = findIntersection();
    //console.log(intersections);

    return (
        <Card sx={cardStyle}>
            <CardContent>
            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                >
                <Typography component="span">Similar Rooms</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography variant="body1">Most Similar Rooms: {finalRoomList.map((roomId) => roomIdMap[roomId]).join(', ')}</Typography>
                </AccordionDetails>
                <AccordionDetails>
                <Typography variant="body1">Room {roomIdMap[props.roomId]} is similar to:</Typography>
                    {Object.entries(props.similarRooms).map(([attribute, roomIds]) => (
                        <div key={attribute}>
                            <li>{attribute}: {roomIds.length > 0 ? roomIds.map((roomId) => roomIdMap[roomId]).join(', ') : 'No similar rooms'}</li>
                        
                        </div>
                    ))}

                </AccordionDetails>
            </Accordion>
            
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                >
                <Typography component="span">Intersections</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <li> Similar Rooms with 4 attributes: {intersections.fourAttributes.length > 0 ? intersections.fourAttributes.map((roomId) => roomIdMap[roomId]).join(', ') : 'No similar rooms'}</li>
                
                <li> Similar Rooms with 3 attributes: {intersections.threeAttributes.length > 0 ? intersections.threeAttributes.map((roomId) => roomIdMap[roomId]).join(', ') : 'No similar rooms'}</li>
                
                <li> Similar Rooms with 2 attributes: {intersections.twoAttributes.length > 0 ? intersections.twoAttributes.map((roomId) => roomIdMap[roomId]).join(', ') : 'No similar rooms'}</li>
                
                <li> Similar Rooms with 1 attribute: {intersections.oneAttribute.length > 0 ? intersections.oneAttribute.map((roomId) => roomIdMap[roomId]).join(', ') : 'No similar rooms'}</li>
                
               
                </AccordionDetails>
            </Accordion>
            
                
            </CardContent>
        </Card>
    );
}