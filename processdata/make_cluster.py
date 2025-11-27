import pymongo
from pymongo import MongoClient
import datetime
from datetime import timedelta
import pandas as pd
import numpy as np
import json
from collections import defaultdict
from tslearn.clustering import silhouette_score
from sklearn.decomposition import PCA
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import ast

from tslearn.clustering import TimeSeriesKMeans
from tslearn.datasets import CachedDatasets
from tslearn.preprocessing import TimeSeriesScalerMeanVariance

columns_list = ["temperature", "airquality", "light", "daylight"]


def main():
    url = "mongodb://localhost:27017/"
    client = MongoClient(url)
    database = client["lab42"]

    # 1. make the dataset by the selected floor and attribute
    floor = 1
    attribute = "light"
    # read the dataset from the csv file
    df = pd.read_csv("dataset_floor_" + str(floor) + "_attribute_" + attribute + ".csv")
    
    # convert the string to the list
    df['attribute_dataset'] = df['attribute_dataset'].apply(ast.literal_eval)
    
    # 2. make the cluster by the dataset
    # implment the time series K-means clustering

    # convert the string to the list
    features = np.array(df['attribute_dataset'].tolist())
    # reshape the features to (n_samples, n_timestamps, 1) format
    features = features.reshape(features.shape[0], features.shape[1], 1)
    

    
    labels = df['room_label']
    dates = df['date_label']

    seed = 23
    
    # standardize the features
    X_train = TimeSeriesScalerMeanVariance().fit_transform(features)
    sz = X_train.shape[1]

    # Define the number of clusters
    sum_of_squared_distances = []
    K = [2, 3, 4, 5, 6]  # 3 written already
    
    for k in K:
        print("Processing k = ", k)
        km = TimeSeriesKMeans(n_clusters=k, n_init=5, metric="dtw", verbose=False, random_state=seed)
        cluster_labels = km.fit_predict(X_train)
        df['cluster_label_'+str(k)] = cluster_labels
        df.to_csv("new_cluster/dataset_floor_" + str(floor) + "_attribute_" + attribute + "_cluster_" + str(k) + ".csv", index=False)
        sum_of_squared_distances.append(km.inertia_)
        print(sum_of_squared_distances)

    print(sum_of_squared_distances)

    # save figure to the file
    plt.plot(K, sum_of_squared_distances, 'bx-')
    plt.xlabel('k')
    plt.ylabel('Sum_of_squared_distances')
    plt.title('Elbow Method For Optimal k')
    plt.savefig("new_cluster/pic_" + "floor_" + str(floor) + "_attribute_" + attribute + ".png")
    
    # plot the trend patterns for each cluster
    for k in K:
        plt.figure(figsize=(12, 6))
        for cluster in range(k):
            cluster_data = features[df['cluster_label_'+str(k)] == cluster]
            mean_trend = np.mean(cluster_data, axis=0)
            plt.plot(mean_trend, label=f'Cluster {cluster}')
        plt.title(f'Trend Patterns for {k} Clusters')
        plt.xlabel('Time')
        plt.ylabel('Change Rate')
        plt.legend()
        plt.savefig(f"new_cluster/trend_patterns_k{k}.png")
        plt.close()

    client.close()


if __name__ == "__main__":
    main()
