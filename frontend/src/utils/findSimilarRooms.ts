
  
export interface GroupedRooms {
    fourAttributes: number[];
    threeAttributes: number[];
    twoAttributes: number[];
    oneAttribute: number[];
    noAttributes: number[];
  }
  
export const groupRoomsByAttributes = (similarRooms: Record<string, number[]>): GroupedRooms => {
    const result: GroupedRooms = {
      fourAttributes: [],
      threeAttributes: [],
      twoAttributes: [],
      oneAttribute: [],
      noAttributes: []
    };
  
    // get all possible room numbers
    const allRooms = new Set<number>();
    Object.values(similarRooms).forEach(rooms => {
      rooms.forEach(room => allRooms.add(room));
    });
  
    // calculate the number of attributes for each room
    const roomAttributeCount = new Map<number, number>();
    const roomAttributeDetails = new Map<number, string[]>();
  
    allRooms.forEach(room => {
      let count = 0;
      const details: string[] = [];
      
      if (similarRooms.temperature.includes(room)) {
        count++;
        details.push('temperature');
      }
      if (similarRooms.airquality.includes(room)) {
        count++;
        details.push('airquality');
      }
      if (similarRooms.light.includes(room)) {
        count++;
        details.push('light');
      }
      if (similarRooms.daylight.includes(room)) {
        count++;
        details.push('daylight');
      }
      
      roomAttributeCount.set(room, count);
      roomAttributeDetails.set(room, details);
    });
  
    // group rooms by the number of attributes
    allRooms.forEach(room => {
      const count = roomAttributeCount.get(room) || 0;
      
      switch (count) {
        case 4:
          result.fourAttributes.push(room);
          break;
        case 3:
          result.threeAttributes.push(room);
          break;
        case 2:
          result.twoAttributes.push(room);
          break;
        case 1:
          result.oneAttribute.push(room);
          break;
        case 0:
          result.noAttributes.push(room);
          break;
      }
    });
  
    // sort each group
    result.fourAttributes.sort((a, b) => a - b);
    result.threeAttributes.sort((a, b) => a - b);
    result.twoAttributes.sort((a, b) => a - b);
    result.oneAttribute.sort((a, b) => a - b);
    result.noAttributes.sort((a, b) => a - b);
  
    return result;
  }
  
  // get the final result list
export const getFinalRoomList = (similarRooms: Record<string, number[]>): number[] => {
    const grouped = groupRoomsByAttributes(similarRooms);
    const finalList: number[] = [];
  
    // add rooms by priority
    if (grouped.fourAttributes.length > 0) {
      finalList.push(...grouped.fourAttributes);
    }
    
    if (grouped.threeAttributes.length > 0) {
      finalList.push(...grouped.threeAttributes);
    }
    
    if (grouped.twoAttributes.length > 0) {
      finalList.push(...grouped.twoAttributes);
    }
    
    if (grouped.oneAttribute.length > 0) {
      finalList.push(...grouped.oneAttribute);
    }
    
    if (grouped.noAttributes.length > 0) {
      finalList.push(...grouped.noAttributes);
    }
  
    return finalList;
  }
export function analyzeRoomDetails(attributes: Record<string, number[]>) {
    
    const allRooms = new Set<number>();
    Object.values(attributes).forEach(rooms => {
      rooms.forEach(room => allRooms.add(room));
    });
  
    const sortedRooms = Array.from(allRooms).sort((a, b) => a - b);
    const roomAttributes: string[] = [];
    sortedRooms.forEach(room => {
      
      
      if (attributes.temperature.includes(room)) roomAttributes.push('temperature');
      if (attributes.airquality.includes(room)) roomAttributes.push('airquality');
      if (attributes.light.includes(room)) roomAttributes.push('light');
      if (attributes.daylight.includes(room)) roomAttributes.push('daylight');
      
      //console.log(`房间 ${room}: 拥有 ${roomAttributes.length} 种属性 [${roomAttributes.join(', ')}]`);

    });
    return roomAttributes;
  }

export const findIntersec = (similarRooms: Record<string, number[]>) => {
    const intersections : {
        keys: string[];
        commonValues: number[];
    }[] = [];

    // find the most common intersection
    

    // find the second most common intersection in the left part
    return intersections;
}
