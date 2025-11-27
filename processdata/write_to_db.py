from pymongo import MongoClient, InsertOne
import json
from collections import defaultdict
import pandas as pd
from datetime import timedelta



def main():

    # create the connection to the db
    client = MongoClient('mongodb://localhost:27017/')

    try:
        # access server infor
        server_info = client.server_info()
        print("successfully connected!")
        print("version:", server_info['version'])
    except Exception as e:
        print("failed to connect:", str(e))




    # delete the database if it exists
    client.drop_database('room_data_lab42')

    # get the database

    db = client['room_data_lab42']

    # get the collection
    roominfo_collection = db['roomInfo']

    # 1. write the roomInfo to the db
    print("Writing roomInfo to the db....")
    file_list = ["first_floor.json", "fourth_floor.json"]
    requesting = []
    for file in file_list:
        with open(file) as f:
            
            myDict = json.loads(f.read())
            for line in myDict:
                requesting.append(InsertOne(line))

    result = roominfo_collection.bulk_write(requesting)
    print(result.modified_count, "documents inserted.")
    
    # 2. write the roomData to the db
        # read json file of room info   
    json_file = "rooms_response.json"
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    data_res = defaultdict(list)
    for element in data:
        if element['floor'] == 1 or element['floor'] == 4:
            data_res[element['floor']].append(element)

    # create the index for the roomData collection
    room_data_collection = db['roomData']
    room_data_collection.create_index([("date", 1), ("floor", 1), ("roomid", 1)])



    for floor, value in data_res.items():
        print("Writing roomData of floor "+str(floor)+" to the db....")
        for room in value:
            
            roomid = room["id"]
            print("processing roomid: "+str(roomid)+"...")


            processed_df = pd.read_csv('room_data/'+str(roomid)+'_processed.csv')
            processed_df['timestamp'] = pd.to_datetime(processed_df['timestamp']).dt.tz_localize(None)
            # print some statistics
            processed_df['date'] = processed_df['timestamp'].dt.date

            
            all_dates = processed_df['date'].unique()
            data_start = processed_df['timestamp'].min()
            data_end = processed_df['timestamp'].max()

            print(f"\nData statistics:")
            print(f"Total rows: {len(processed_df)}")
            print(f"Data per day: {len(processed_df) // len(all_dates)}")
            print(f"Data range: {data_start} to {data_end}")

            # save the processed data to the db
            print("saving data to the db...")
            
            

            for date in all_dates:
                record = {}
                record['roomid'] = roomid
                record['floor'] = floor
                record['date'] = date.strftime('%Y-%m-%d')
                record_in_date = processed_df[processed_df['date'] == date]
                record_in_date = record_in_date.sort_values(by='timestamp')       # sort the data by timestamp
                sensor_data = record_in_date[['timestamp', 'temperature', 'airquality', 'light', 'daylight', 'time_slot']].to_dict(orient='records')
                record['sensor_data'] = sensor_data
                
                room_data_collection.insert_one(record)
            print("Finish saving data to the db of floor "+str(floor)+" of room "+str(roomid)+"...")


            datarangecol = db["dateRange"]
            record = {
                "roomid": roomid,
                "floor": floor,
                "time_start": (data_start+timedelta(days=1)).strftime('%Y-%m-%d'),    # jump the first day
                "time_end": (data_end-timedelta(days=1)).strftime('%Y-%m-%d')         # jump the last day
            }
            datarangecol.insert_one(record)
            print("Finish saving data range to the db of floor "+str(floor)+" of room "+str(roomid)+"...")
            print("--------------------------------")

    client.close()

if __name__ == "__main__":
    main()
