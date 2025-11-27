import pymongo
from pymongo import MongoClient
import datetime
from datetime import timedelta
import pandas as pd
import numpy as np
import json
import csv
from collections import defaultdict
from tslearn.clustering import silhouette_score
from sklearn.decomposition import PCA
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split


columns_list = ["temperature", "airquality", "light", "daylight"]


def make_dataset(database, floor, attribute):

    # get the information of the room of the floor
    room_info = list(database["roomInfo"].find({"floor": floor}))

    room_dataset = []   # store the data of the attribute
    date_label = []     # store the date of the data
    room_label = []     # store the room id of the data

    for room in room_info:
        room_id = room["room_id"]
        print(">>>>>>>>> Processing room: ", room_id)
        
        # get the available date range for each room
        datarange = database["datarange"].find_one({"roomid": room_id})
        start_date = datarange["time_start"]
        end_date = datarange["time_end"]
        print("start_date: ", start_date)
        # set the data length per day
        data_length = 24 if room["floor"] == 4 else 48

        # get the data from the database
        start_time = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        end_time = datetime.datetime.strptime(end_date, "%Y-%m-%d")


        while start_time <= end_time:
            # query the data from the database
            current_date = start_time.strftime("%Y-%m-%d")
            data = list(database[current_date].find({"roomid": room_id}))
            #print(current_date)

            data_df = pd.DataFrame(data)

            # check if the attribute is available, then store the data to the room_dataset
            if attribute not in data_df.columns:
                print(">>>>>>>>> Attribute not found: ", attribute)
                print("roomid: ", room_id, "current_date: ", current_date, "data_df: ", data_df.columns)
                
                # store the exception record to the database
                exception_record = {
                    "roomid": room_id,
                    "current_date": current_date,
                    "attribute": attribute,
                    "floor": floor
                }
                database["exception"].insert_one(exception_record)

            elif attribute in room["room_sensors"] and room["room_sensors"][attribute]:
                # reserve the data length in the data and store the data to the room_dataset        
                # sort the data by sequence, and the sequence must be unique
                data_df = data_df.sort_values(by="time_slot")
                data_df = data_df.drop_duplicates(subset=["time_slot"])

                # store the data to the room_dataset
                room_dataset.append(list(data_df[attribute]))
                date_label.append(current_date)
                room_label.append(room_id)
            

            start_time += datetime.timedelta(days=1)


    # store the data to the alldataset
    assert len(room_dataset) == len(date_label) == len(room_label)
    df = pd.DataFrame({"attribute_dataset": room_dataset, "date_label": date_label, "room_label": room_label})

    return df



def main():
    url = "mongodb://localhost:27017/"
    client = MongoClient(url)
    database = client["lab42"]

    # 1. make the dataset by the selected floor and attribute
    floor = 4
    attribute = "light"

    print("-------------------------------- Making dataset for floor: ", floor, "and attribute: ", attribute)
    df = make_dataset(database, floor, attribute)

    # save the dataset to the csv file
    df.to_csv("dataset_floor_" + str(floor) + "_attribute_" + attribute + ".csv", index=False)
    #print("Original dataset: ", df.head())

    print("-------------------------------- Dataset length: ", len(df))

    
    client.close()


if __name__ == "__main__":
    main()
