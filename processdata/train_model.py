import pymongo
from pymongo import MongoClient
import datetime
from datetime import timedelta
import pandas as pd
import numpy as np
import json
from collections import defaultdict
import tslearn.clustering
from sklearn.decomposition import PCA
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import ast
from sklearn.manifold import TSNE

from tslearn.clustering import TimeSeriesKMeans
from tslearn.datasets import CachedDatasets
from tslearn.preprocessing import TimeSeriesScalerMeanVariance
import joblib

from tslearn.metrics import cdist_dtw

columns_list = ["temperature", "airquality", "light", "daylight"]


n_clusters ={
    1:{
        'temperature' :  [3]
        #'airquality':3    # DONE
    }, 
}

def main():


    # 1. make the dataset by the selected floor and attribute
    for floor, value in n_clusters.items():
        for attribute, k_list in value.items():
            for k in k_list:
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

                seed = 42    #42
                
                # standardize the features
                X_train = TimeSeriesScalerMeanVariance().fit_transform(features)
                #sz = X_train.shape[1]

                # Define the number of clusters
                #sum_of_squared_distances = 0
                #K = [3]  # 3 written already
                print(">>>>>>>>>>>>>>>>>>>>> floor = ", floor, " attribute = ", attribute, " k = ", k)
                km = TimeSeriesKMeans(n_clusters=k, n_init=3, metric="dtw", max_iter_barycenter=10,verbose=False, random_state=seed)
                cluster_labels = km.fit_predict(X_train)
                sum_of_squared_distances = km.inertia_

                # compute the silhouette score
                
                sil_score = tslearn.clustering.silhouette_score(X_train, cluster_labels, metric="dtw")
                print(">>>>> silhouette_score = ", sil_score)

                

                # write the sum_of_squared_distances and random state to the file


            with open("model/dataset_floor_" + str(floor) + "_attribute_" + attribute + "_seed_" + str(seed) + ".txt", "w") as f:
                f.write("random state = " + str(seed) + "\n")
                f.write("k = " + str(k) + "\n")
                f.write("sum_of_squared_distances = " + str(sum_of_squared_distances) + "\n")
                f.write("silhouette_score = " + str(sil_score) + "\n")
                f.close()
            print(">>>>> sum_of_squared_distances = ", sum_of_squared_distances)

                # save the embedding picture to the file
                

                # save the embedding to the file

            # present the cluster center
     
            


if __name__ == "__main__":
    main()
