
export const attributes = ['temperature', 'airquality', 'light', 'daylight'] as const;
export type AttributeType = typeof attributes[number];


export interface AverageSensorData {
  roomid: number | null;
  temperature: number | null;
  airquality: number | null;
  daylight: number | null;
  light: number | null;
};

export interface sensorAvailability{
  temperature: boolean;
  airquality: boolean;
  light: boolean;
  daylight: boolean;
};


export interface SensorData {
  roomid: number;
  temperature: number;
  airquality: number;
  daylight: number;
  light: number;
};


  