import pandas as pd
import numpy as np
from datetime import datetime, timedelta    
from pymongo import MongoClient
import json
from collections import defaultdict

value_columns = ['temperature', 'airquality', 'light', 'daylight']

def process_daily_data(df, floor):
    timeslot_num = 24 if floor == 4 else 48
    # 确保timestamp列是datetime类型，并转换为UTC时区
    df['timestamp'] = pd.to_datetime(df['timestamp']).dt.tz_localize(None)
    
    # sort the data by timestamp
    df = df.sort_values('timestamp')
    
    # add the date column
    df['date'] = df['timestamp'].dt.date
    df['time_slot'] = df['timestamp'].dt.hour * 2 + df['timestamp'].dt.minute // 30

    # deal with the type of the data
    df[value_columns] = df[value_columns].astype(float)
    # deal with the type of the data
    df[value_columns] = df[value_columns].astype(float)
    
    # create a new DataFrame to store the processed data
    filled_df = df.copy()
    
    # get all unique dates
    unique_dates = sorted(df['date'].unique())
    count = 0
    
    for i, date in enumerate(unique_dates[1:]):
        previous_date = date - pd.Timedelta(days=1)
        current_day = df[df['date'] == date]
        previous_day = df[df['date'] == previous_date]

        # find the missing time slots
        all_slots = set(range(timeslot_num))
        existing_slots = set(current_day['time_slot'])
        missing_slots = all_slots - existing_slots
        
        for slot in missing_slots:
            #print(f"处理{date}的第{slot}个时间槽")
            # find the nearest non-missing value
            before_slot = max([s for s in existing_slots if s < slot], default=None)
            after_slot = min([s for s in existing_slots if s > slot], default=None)
            
            # get the data of the previous day in the nearest time slot
            prev_day_values = previous_day[
                (previous_day['time_slot'] >= slot - 1) & 
                (previous_day['time_slot'] <= slot + 1)
            ]
            
            # get the data of the current day in the nearest time slot
            current_before = current_day[current_day['time_slot'] == before_slot].iloc[0] if before_slot is not None else None
            current_after = current_day[current_day['time_slot'] == after_slot].iloc[0] if after_slot is not None else None
            
            # create a new timestamp
            new_timestamp = pd.Timestamp.combine(
                date,
                pd.Timestamp(f"{slot // 2:02d}:{30 if slot % 2 else 00:02d}:00").time()
            )
            
            # initialize the filled value dictionary
            filled_dict = {
                'timestamp': new_timestamp + timedelta(minutes=10),
                'time_slot': slot,
                'date': date
            }
            
            # calculate the filled value for each value column
            for col in value_columns:
                try:
                    if len(prev_day_values) > 2:
                        # use the rate of the previous day
                        prev_values = prev_day_values[col].values
                        rate1 = prev_values[1] / prev_values[0] if prev_values[0] != 0 else 1
                        rate2 = prev_values[2] / prev_values[0] if prev_values[0] != 0 else 1
                        avg_rate = (rate1 + rate2) / 2
                        filled_dict[col] = current_before[col] * avg_rate if current_before is not None else prev_values[1]
                        
                    elif len(prev_day_values) == 2:
                        # use the rate of the two points
                        prev_values = prev_day_values[col].values
                        change = prev_values[1] - prev_values[0]
                        filled_dict[col] = prev_values[1] + change
                    
                    elif len(prev_day_values) == 1:
                        # use the value of the previous day
                        filled_dict[col] = prev_day_values[col].iloc[0]
                    
                    elif current_before is not None and current_after is not None:
                        # use the linear interpolation of the current day
                        filled_dict[col] = (current_before[col] + current_after[col]) / 2
                    
                    elif current_before is not None:
                        # use the value of the previous day
                        filled_dict[col] = current_before[col]
                        
                    elif current_after is not None:
                        # use the value of the current day
                        filled_dict[col] = current_after[col]
                        
                    else:
                        # if there is no reference value, use the average value of the current day or other default value
                        filled_dict[col] = current_day[col].mean()  # or use other suitable default value
                        
                except Exception as e:
                    print(f"Error processing {col} at {new_timestamp}: {str(e)}")
                    # if there is an error, use the average value of the current day or other default value
                    filled_dict[col] = current_day[col].mean()  # or use other suitable default value
            #print(filled_dict)
            # only add to the result when all the columns have values
            #if all(col in filled_dict for col in value_columns):
            filled_df = pd.concat([filled_df, pd.DataFrame([filled_dict])], ignore_index=True)
            count += 1
            
            #if count >= 10:
            #    break
        
        #if count >= 10:
        #    break
    
   
    
    result_df = filled_df
    
    # add the sequence column
    result_df['sequence'] = result_df.groupby('date').cumcount() + 1
    
    # sort the data by date and sequence
    #result_df = result_df.sort_values(['date', 'sequence'])
    
    # only keep the needed columns
    result_df = result_df[['sequence'] + value_columns + ['timestamp']]
    
    return result_df



def main():
    

    # create the connection to the db
    client = MongoClient('mongodb://localhost:27017/')
    # access server infor
    server_info = client.server_info()
    print("susuccessfully connected!--------------------------------")
    mydb = client["lab42"]

    # read json file of room info   
    json_file = "rooms_response.json"
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    data_res = defaultdict(list)
    for element in data:
        if element['floor'] == 1 or element['floor'] == 4:
            data_res[element['floor']].append(element)

    for floor, value in data_res.items():
        if floor != 1:   # only process floor 1 TODO
            continue
        for room in value:
            
            roomid = room["id"]
            # skip the saved room
            
            #if roomid <= 170 or roomid == 311:
            #0    continue
            print(roomid)
            mydf = pd.read_csv("room_data/"+str(roomid)+".csv")
    
            # fill missing data
            processed_df = process_daily_data(mydf, 1)
        
            # save the processed data
            processed_df.to_csv('room_data/'+str(roomid)+'_processed.csv', index=False)
            print("Finish filling missing data, saved to room_data/"+str(roomid)+"_processed.csv")
        
            # print some statistics
            print(f"\nData statistics:")
            print(f"Total rows: {len(processed_df)}")
            print(f"Data per day: {len(processed_df) // len(processed_df['timestamp'].dt.date.unique())}")
            print(f"Data range: {processed_df['timestamp'].min()} to {processed_df['timestamp'].max()}")

            # save the processed data to the db
            for index, row in processed_df.iterrows():
                mycollection = mydb[row['timestamp'].date().strftime('%Y-%m-%d')]
                record = row.to_dict()
                record['roomid'] = roomid
                mycollection.insert_one(record)
        print("Finish saving data to the db of floor "+str(floor)+" of room "+str(roomid)+"...")
        print("--------------------------------")

    client.close()
if __name__ == "__main__":
    main() 