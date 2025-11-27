import pandas as pd
import numpy as np
from datetime import datetime, timedelta    
from pymongo import MongoClient
import json
from collections import defaultdict

value_columns = ['temperature', 'airquality', 'light', 'daylight']

def process_daily_data(df, floor):
    timeslot_num = 24 if floor == 4 else 48
    # ensure the timestamp is datetime type
    df['timestamp'] = pd.to_datetime(df['timestamp']).dt.tz_localize(None)
    
    # sort the data by timestamp
    df = df.sort_values('timestamp')
    
    # add the date column
    df['date'] = df['timestamp'].dt.date
    df['time_slot'] = df['timestamp'].dt.hour * 2 + df['timestamp'].dt.minute // 30 if floor == 1 else (df['timestamp'] + timedelta(minutes=10)).dt.hour

    # drop rows with temperature value at '.'
    df = df[df['temperature'] != '.']

    df[value_columns] = df[value_columns].replace('.', 0)

    # deal with the type of the data
    df[value_columns] = df[value_columns].astype(float)
    
    # create a new DataFrame to store the processed data
    filled_df = df.copy()
    
    # get all unique dates
    unique_dates = sorted(df['date'].unique())
    count = 0
    
    for i, date in enumerate(unique_dates[1:-1]):
        previous_date = date - pd.Timedelta(days=1)
        current_day = df[df['date'] == date]
        previous_day = df[df['date'] == previous_date]

        # find the missing time slots
        all_slots = set(range(timeslot_num))
        existing_slots = set(current_day['time_slot'])
        missing_slots = all_slots - existing_slots
        
        for slot in missing_slots:
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
            
            # create a new timestamp for the missing data, different for floor 4 and floor 1
            if floor == 4:
                new_timestamp = pd.Timestamp.combine(
                    date,
                    pd.Timestamp(f"{slot:02d}:{10:02d}:00").time()
                ) 
            elif floor == 1:
                new_timestamp = pd.Timestamp.combine(
                    date,
                    pd.Timestamp(f"{slot // 2:02d}:{40 if slot % 2 else 10:02d}:00").time()
                )
             
            
            # initialize the filled value dictionary
            filled_dict = {
                'timestamp': new_timestamp,
                'time_slot': slot,
                'date': date
            }
            
            # calculate the filled value for each value column
            for col in value_columns:
                try:
                    if before_slot == slot - 1 and after_slot == slot + 1 and len(prev_day_values) > 2:
                        # use the value of the current day

                        filled_dict[col] = ((prev_day_values[col].iloc[1] - prev_day_values[col].iloc[0]) + 5*current_before[col] + (prev_day_values[col].iloc[2] - prev_day_values[col].iloc[1]) + 5*current_after[col])/10
                    elif before_slot == slot - 1 and len(prev_day_values) >= 2:
                        # use the rate of the previous day and the data before the slot
                        prev_values = prev_day_values[col].values
                        rate1 = prev_values[1] / prev_values[0] if prev_values[0] != 0 else 1
                        filled_dict[col] = (current_before[col]*rate1 +current_before[col]*9)/10
                        
                    elif after_slot == slot + 1 and len(prev_day_values) >= 2:
                        # use the rate of the previous day and the data after the slot
                        prev_values = prev_day_values[col].values
                        rate1 = prev_values[1] / prev_values[0] if prev_values[0] != 0 else 1
                        filled_dict[col] = (current_after[col]*rate1 +current_after[col]*9)/10
                    
                    elif len(prev_day_values) == 1 and current_before is not None:
                        # use the value of the previous day
                        filled_dict[col] = (current_before[col]*9 + prev_day_values[col].iloc[0]) / 10
                    
                    elif current_before is not None and current_after is not None:
                        # use the linear interpolation of the current day
                        filled_dict[col] = (current_before[col]*9 + current_after[col]) / 10 if slot - before_slot < after_slot - slot else (current_before[col] + current_after[col]*9) / 10
                    
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
            #print("--------------------------------")
            # only add to the result when all the columns have values
            #if all(col in filled_dict for col in value_columns):
            filled_df = pd.concat([filled_df, pd.DataFrame([filled_dict])], ignore_index=True)
            count += 1
            
            #if count >= 60:
            #    break
        
        #if count >= 60:
        #    break
    
   
    
    result_df = filled_df
    
    # add the sequence column
    #result_df['sequence'] = result_df.groupby('date').cumcount() + 1
    
    # sort the data by date and sequence
    #result_df = result_df.sort_values(['date', 'sequence'])
    
    # only keep the needed columns
    result_df = result_df[['time_slot'] + value_columns + ['timestamp']]
    
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

        for room in value:
            
            roomid = room["id"]

            print("processing roomid: "+str(roomid)+" of floor: "+str(floor)+"...")
            mydf = pd.read_csv("room_data/"+str(roomid)+".csv")
    
            # fill missing data
            processed_df = process_daily_data(mydf, floor)
        
            # save the processed data
            processed_df.to_csv('room_data/'+str(roomid)+'_processed.csv', index=False)
            print("Finish filling missing data, saved to room_data/"+str(roomid)+"_processed.csv")
        
            # print some statistics
            data_start = processed_df['timestamp'].min()
            data_end = processed_df['timestamp'].max()
            print(f"\nData statistics:")
            print(f"Total rows: {len(processed_df)}")
            print(f"Data per day: {len(processed_df) // len(processed_df['timestamp'].dt.date.unique())}")
            print(f"Data range: {data_start} to {data_end}")

            # save the processed data to the db
            print("saving data to the db...")
            for index, row in processed_df.iterrows():
                mycollection = mydb[row['timestamp'].date().strftime('%Y-%m-%d')]
                record = row.to_dict()
                record['roomid'] = roomid
                mycollection.insert_one(record)
            print("Finish saving data to the db of floor "+str(floor)+" of room "+str(roomid)+"...")


            datarangecol = mydb["datarange"]
            record = {
                "roomid": roomid,
                "floor": floor,
                "time_start": (data_start+timedelta(days=1)).strftime('%Y-%m-%d'),    # jump the first day
                "time_end": (data_end-timedelta(days=1)).strftime('%Y-%m-%d')         # jump the last day
            }
            datarangecol.insert_one(record)
            print("Finish saving data range to the db of floor "+str(floor)+" of room "+str(roomid)+"...")
            print("--------------------------------")
        # save the data range to the db
        

    client.close()

def test_main():
    roomid = 145
    floor = 4
    df = pd.read_csv("room_data/"+str(roomid)+".csv")
    processed_df = process_daily_data(df, floor)
    processed_df.to_csv('room_data/'+str(roomid)+'_processed.csv', index=False)
    print("Finish filling missing data, saved to room_data/"+str(roomid)+"_processed.csv")
    print("Data statistics:")
    print(f"Total rows: {len(processed_df)}")
    print(f"Data per day: {len(processed_df) // len(processed_df['timestamp'].dt.date.unique())}")
    print(f"Data range: {processed_df['timestamp'].min()} to {processed_df['timestamp'].max()}")
    """
    client = MongoClient('mongodb://localhost:27017/')
    mydb = client["lab42"]
    datarangedb = mydb["datarange"]
    record = {
        "roomid": roomid,
        "floor": floor,
        "timestamp": (processed_df['timestamp'].min() + timedelta(days=1)).strftime('%Y-%m-%d'),    # jump the first day
        "timestamp_end": (processed_df['timestamp'].max()).strftime('%Y-%m-%d')
    }
    datarangedb.insert_one(record)
    """

if __name__ == "__main__":
    main() 