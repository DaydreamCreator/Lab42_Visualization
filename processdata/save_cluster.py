from pymongo import MongoClient
import pandas as pd


n_clusters ={
    1:{
        'temperature' : 3,
        'light' : 3,
        'daylight': 3,    # DONE
        'airquality':3    # DONE
    },
    4:{
        'temperature' : 4,  #DONE
        'light' : 4,
        'daylight': 4,   #DONE
    }
}


def main():
    url = "mongodb://localhost:27017/"
    client = MongoClient(url)
    database = client["room_data_lab42"]
    collection_list = ["temperatureCluster", "lightCluster", "daylightCluster", "airqualityCluster"]
    # drop the collection if they exist
    for collection in collection_list:
        database[collection].drop()

    collection = database["clusterData"]
    collection.drop()


    for floor, value in n_clusters.items():
        for attribute, n_cluster in value.items():
            collection.create_index([("date", 1), ("floor", 1), ("attribute", 1), ("roomid", 1)])
            cluster_file = "new_cluster/dataset_floor_" + str(floor) + "_attribute_" + attribute + "_cluster_" + str(n_cluster) + ".csv"
            df = pd.read_csv(cluster_file)
            #print(df.head())

            
            for index, row in df.iterrows():
                date_label = row['date_label']
                room_label = row['room_label']
                cluster_label = row['cluster_label_'+str(n_cluster)]
                collection.insert_one({"attribute": attribute, "date": date_label, "floor":int(floor), "roomid": int(room_label), "nclusters": int(n_cluster), "cluster": int(cluster_label)})
        
            print("Inserted " + str(len(df)) + " documents" + " for " + attribute + " on floor " + str(floor) + " with n_cluster = " + str(n_cluster))
    
    client.close()


if __name__ == "__main__":
    main()
