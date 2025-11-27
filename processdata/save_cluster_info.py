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
    #   collection_list = ["temperatureCluster", "lightCluster", "daylightCluster", "airqualityCluster"]
    # drop the collection if they exist
    #for collection in collection_list:
    #    database[collection].drop()

    # save the cluster info to the database

    collection = database["clusterInfo"]
    collection.drop()
    collection.create_index([("attribute", 1), ("floor", 1), ("cluster", 1)])

    for floor, value in n_clusters.items():
        for attribute, n_cluster in value.items():
            cluster_file = "cluster_trends/" + attribute + "_floor_" + str(floor) + "_cluster_statistics.csv"
            df = pd.read_csv(cluster_file)
            #print(df.head())

            
            for index, row in df.iterrows():
               
                collection.insert_one({"attribute": attribute, "floor":floor, "cluster": int(row['cluster']), \
                                       "mean": float(row['mean']), "std": float(row['std']), "min": float(row['min']), \
                                        "max": float(row['max']), "count": int(row['count'])})
        
            print("Cluster Info Inserted " + str(len(df)) + " documents" + " for " + attribute + " on floor " + str(floor) + " with n_cluster = " + str(n_cluster))
        # save the cluster info to the database
    collection = database["clusterTrends"]
    collection.drop()
    collection.create_index([("attribute", 1), ("floor", 1), ("cluster", 1)])
    for floor, value in n_clusters.items():
        for attribute, n_cluster in value.items():
            for cluster in range(n_cluster):    
                cluster_file = "cluster_trends/" + attribute + "_floor_" + str(floor) + "_cluster_" + str(cluster) + "_trends.csv"
                df = pd.read_csv(cluster_file)
                #print(df.head())

            
                for index, row in df.iterrows():
               
                    collection.insert_one({"attribute": attribute, "floor":floor, "cluster": cluster, \
                                        "time_slot": int(row['time_points']), "mean_ts": float(row['mean_ts']), \
                                        "std_ts": float(row['std_ts'])})
        
                print("Cluster Trends Inserted " + str(len(df)) + " documents" + " for " + attribute + " on floor " + str(floor) + " with n_cluster = " + str(n_cluster))
   
   
    collection = database["clusterDistribution"]
    collection.drop()
    collection.create_index([("attribute", 1), ("floor", 1), ("roomid", 1)])
    for floor, value in n_clusters.items():
        for attribute, n_cluster in value.items():
        
            cluster_file = "cluster_trends/" + attribute + "_floor_" + str(floor) + "_cluster_distribution.csv"
            df = pd.read_csv(cluster_file)
            #print(df.head())

        
            for index, row in df.iterrows():
                distribution = []
                for cluster in range(n_cluster):
                    distribution.append(round(float(row[str(cluster)]), 2))
                print(row['room_label'], distribution)
                collection.insert_one({"attribute": attribute, "floor":int(floor), "roomid": int(row['room_label']), \
                                       "nclusters": int(n_cluster),
                                        "distribution": distribution})

            print("Cluster Distribution Inserted " + str(len(df)) + " documents" + " for " + attribute + " on floor " + str(floor) + " with n_cluster = " + str(n_cluster))

    client.close()


if __name__ == "__main__":
    main()
