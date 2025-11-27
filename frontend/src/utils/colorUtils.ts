import { AverageSensorData } from "../types/SensorType";
import { attributes } from "../types/SensorType";
import { ClusterData } from "../types/ClusterType";

interface colorList{
  temperature: Record<number, string>;
  airquality: Record<number, string>;
  light: Record<number, string>;
  daylight: Record<number, string>;
}

//#27548A


export const generateColorByDataList = (
  valueList: AverageSensorData[],
  hue: number = 210
): colorList => {
  const result: colorList = {
    temperature: {},
    airquality: {},
    light: {},
    daylight: {}
  };

  
  for (const attribute of attributes) {
    // get the value list of the attribute
    const values = valueList
      .map(data => ({
        roomId: data.roomid,
        value: data[attribute]
      }))
      .filter(item => item.roomId !== null && item.value !== null) as { roomId: number; value: number }[];

    if (values.length === 0) continue;

    // calculate the max and min value of the attribute
    const maxValue = Math.max(...values.map(v => v.value));
    const minValue = Math.min(...values.map(v => v.value));

    // calculate the color of each room
    values.forEach(({ roomId, value }) => {
      // calculate the lightness value (0-100), the bigger the value, the lower the lightness (the color is darker)
      const lightness = 100 - ((value - minValue) / (maxValue - minValue)) * 50;
      // generate the HSL color
      const color = `hsl(${hue}, 70%, ${lightness}%)`;
      result[attribute][roomId] = color;
    });
  }
  //console.log(result);
  return result;
}


export const clusterColorList =  ['#50b131', '#36acae', '#f77189', '#f37a32', '#38a9c5', '#3ba3ec', '#9591f4', '#cc7af4', '#f560e4', '#f66ab7'];



export const generateColorByCluster = (
  cluster: ClusterData[],
  
): Record<number, string> => {
  const result: Record<number, string> = {};
  cluster.forEach((item, index) => {
    result[item.roomid] = clusterColorList[item.cluster % clusterColorList.length];
  });
  return result;
  };



  /*
 * @param value 输入数值
 * @param minValue 最小值
 * @param maxValue 最大值
 * @param startHue 起始色相 (0-360)
 * @param endHue 结束色相 (0-360)
 * @returns HSL颜色字符串
 */
export const generateGradientColorByValue = (
  value: number,
  minValue: number,
  maxValue: number,
  startHue: number = 200, // 默认起始为蓝色
  endHue: number = 0      // 默认结束为红色
): string => {
  // 确保输入值在范围内
  const normalizedValue = Math.min(Math.max(value, minValue), maxValue);
  
  // 计算色相值
  const hue = startHue + ((normalizedValue - minValue) / (maxValue - minValue)) * (endHue - startHue);
  
  // 计算亮度值 (0-100)
  const lightness = 100 - ((normalizedValue - minValue) / (maxValue - minValue)) * 50;
  
  // 返回HSL颜色字符串
  return `hsl(${hue}, 70%, ${lightness}%)`;
}; 