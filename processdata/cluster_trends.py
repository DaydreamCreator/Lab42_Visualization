import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import ast
from sklearn.preprocessing import StandardScaler
from datetime import datetime
from tslearn.preprocessing import TimeSeriesScalerMeanVariance

# load the csv file
floor = 1
attribute = "daylight"
cluster = 3

df = pd.read_csv("new_cluster/dataset_floor_" + str(floor) + "_attribute_" + attribute + "_cluster_" + str(cluster) + ".csv")
dir = "cluster_trends/"

# process the attribute_dataset column, convert the string list to actual numerical list
def parse_list_string(list_str):
    try:
        # try to parse the string list
        parsed_list = ast.literal_eval(list_str)
        # convert the list to numpy array
        return np.array(parsed_list)
    except (ValueError, SyntaxError):
        # if the parsing fails, return an empty array
        return np.array([])

# convert the string list to numpy array
df['attribute_dataset'] = df['attribute_dataset'].apply(parse_list_string)

# use TimeSeriesScalerMeanVariance to process the data
scaler = TimeSeriesScalerMeanVariance()
processed_arrays = []
for arr in df['attribute_dataset']:
    if len(arr) > 0:
        # reshape the array to fit the requirements of scaler (n_samples, n_timestamps, n_features)
        arr_reshaped = arr.reshape(1, -1, 1)
        processed = scaler.fit_transform(arr_reshaped)
        processed_arrays.append(processed[0, :, 0])
    else:
        processed_arrays.append(np.array([]))

# add the processed data to the dataframe
df['processed_dataset'] = processed_arrays

# important: here, we do not extract single values from attribute_dataset
# because we will use the entire time series data for trend analysis

# 使用您的列名映射
df.rename(columns={
    'date_label': 'date',
    'cluster_label_' +str(cluster): 'cluster'
}, inplace=True)

# remove the rows that contain empty arrays
df = df[df['processed_dataset'].apply(lambda x: len(x) > 0)]

# convert the date format
if not pd.api.types.is_datetime64_any_dtype(df['date']):
    df['date'] = pd.to_datetime(df['date'])

# set the plot style
plt.figure(figsize=(14, 10))
sns.set_style("whitegrid")

# get the unique cluster labels and room labels
clusters = df['cluster'].unique()
rooms = df['room_label'].unique()
colors = sns.color_palette("husl", len(clusters))

# extract the length of the time series data
# if the length is different, it may need extra processing
ts_length = max(df['processed_dataset'].apply(len))
time_points = np.arange(ts_length)

# plot the trend lines for each cluster
plt.figure(figsize=(14, 8))
for i, cluster in enumerate(clusters):
    cluster_data = df[df['cluster'] == cluster]
    
    # calculate the mean of all time series in the cluster
    cluster_arrays = []
    for arr in cluster_data['processed_dataset']:
        if len(arr) == ts_length:  # only use the time series with the same length
            cluster_arrays.append(arr)
    
    if cluster_arrays:
        # stack all time series and calculate the mean
        stacked_arrays = np.vstack(cluster_arrays)
        mean_ts = np.mean(stacked_arrays, axis=0)
        std_ts = np.std(stacked_arrays, axis=0)
        
        # plot the mean and confidence interval
        plt.plot(time_points, mean_ts, linewidth=2, color=colors[i], label=f'Cluster {cluster}')
        plt.fill_between(time_points, mean_ts-std_ts, mean_ts+std_ts, color=colors[i], alpha=0.2)

#plt.title('Time series clustering trends', fontsize=16)
#plt.xlabel('Time points', fontsize=14)
#plt.ylabel(f'Standardized {attribute} Rate of Change', fontsize=14)
plt.legend(loc='best')
plt.grid(True)
plt.tight_layout()
plt.savefig(dir+attribute+'_floor_'+str(floor)+'_trends_overall.png')
plt.show()

# save the figure to the file
#fig, axes = plt.subplots(len(clusters), 1, figsize=(14, 5*len(clusters)))
#if len(clusters) == 1:
#    axes = [axes]  # ensure axes is always a list, even if there is only one cluster

for i, cluster in enumerate(clusters):
    cluster_data = df[df['cluster'] == cluster]
    
    # calculate the mean of all time series in the cluster
    cluster_arrays = []
    for arr in cluster_data['processed_dataset']:
        if len(arr) == ts_length:  # only use the time series with the same length
            cluster_arrays.append(arr)
    
    if cluster_arrays:
        # stack all time series and calculate the mean
        stacked_arrays = np.vstack(cluster_arrays)
        mean_ts = np.mean(stacked_arrays, axis=0)
        std_ts = np.std(stacked_arrays, axis=0)

        # save the data to csv file
        data = {
            'attribute': attribute,
            'floor': floor,
            'cluster': cluster,
            'time_points': time_points,
            'mean_ts': mean_ts,
            'std_ts': std_ts,

        }
        data_df = pd.DataFrame(data)
        data_df.to_csv(dir+attribute+'_floor_'+str(floor)+f'_cluster_{cluster}_trends.csv', index=False)
        
        # plot the mean and confidence interval
        plt.figure(figsize=(14, 8))
        plt.plot(time_points, mean_ts, linewidth=2, color=colors[i], label=f'Cluster {cluster}')
        plt.fill_between(time_points, mean_ts-std_ts, mean_ts+std_ts, color=colors[i], alpha=0.2)
    
        #plt.title(f'Cluster {cluster} Trends', fontsize=14)
        #plt.ylabel(f'Standardized {attribute} Rate of Change', fontsize=12)
        #plt.xlabel('Time points', fontsize=12)
        plt.grid(True)
        plt.legend()

        plt.savefig(dir+attribute+'_floor_'+str(floor)+f'_cluster_{cluster}_trends.png')
        plt.show()
        plt.close()


#plt.tight_layout()
#plt.savefig(dir+attribute+'_floor_'+str(floor)+'_trends_separate.png')
#plt.show()

# plot the trend lines for each cluster by room
for room in rooms:
    room_data = df[df['room_label'] == room]
    if len(room_data) > 0:
        plt.figure(figsize=(14, 8))
        
        for i, cluster in enumerate(clusters):
            cluster_room_data = room_data[room_data['cluster'] == cluster]
            
            # collect all time series in the cluster for the room
            cluster_room_arrays = []
            for arr in cluster_room_data['processed_dataset']:
                if len(arr) == ts_length:  # only use the time series with the same length
                    cluster_room_arrays.append(arr)
            
            if cluster_room_arrays:
                # stack all time series and calculate the mean
                stacked_arrays = np.vstack(cluster_room_arrays)
                mean_ts = np.mean(stacked_arrays, axis=0)
                
                # plot the mean line
                plt.plot(time_points, mean_ts, linewidth=2, color=colors[i], 
                         label=f'Cluster {cluster} (n={len(cluster_room_arrays)})')
        
        #plt.title(f'Room {room} 的聚类趋势', fontsize=16)
        plt.xlabel('Time points', fontsize=14)
        plt.ylabel(f'Standardized {attribute} Rate of Change', fontsize=14)
        plt.legend(loc='best')
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(dir+'room_'+str(room)+'_cluster_'+attribute+'_trends.png')



print("statistics for each cluster:")
for cluster in clusters:
    cluster_data = df[df['cluster'] == cluster]
    
    # 收集该聚类的所有时间序列
    cluster_arrays = []
    for arr in cluster_data['processed_dataset']:
        if len(arr) == ts_length:
            cluster_arrays.append(arr)
    
    if cluster_arrays:
        stacked_arrays = np.vstack(cluster_arrays)
        
        print(f"\nCluster {cluster}:")
        print(f"Time series number: {len(cluster_arrays)}")
        print(f"Mean: {np.mean(stacked_arrays):.4f}")
        print(f"Standard deviation: {np.std(stacked_arrays):.4f}")
        print(f"Minimum: {np.min(stacked_arrays):.4f}")
        print(f"Maximum: {np.max(stacked_arrays):.4f}")

    else:
        print(f"\nCluster {cluster}: no complete time series data")

# analyze the cluster distribution by room
print("\n\nCluster distribution by room:")
for room in rooms:
    room_data = df[df['room_label'] == room]
    print(f"\nRoom {room}:")
    cluster_counts = room_data['cluster'].value_counts()
    for cluster, count in cluster_counts.items():
        print(f"  Cluster {cluster}: {count} time series ({count/len(room_data)*100:.1f}%)")
    
# save the analysis results to csv file
cluster_stats = []
for cluster in clusters:
    cluster_data = df[df['cluster'] == cluster]
    

    cluster_arrays = []
    for arr in cluster_data['processed_dataset']:
        if len(arr) == ts_length:
            cluster_arrays.append(arr)
    
    if cluster_arrays:
        stacked_arrays = np.vstack(cluster_arrays)
        stats = {
            'cluster': cluster,
            'count': len(cluster_arrays),
            'mean': np.mean(stacked_arrays),
            'std': np.std(stacked_arrays),
            'min': np.min(stacked_arrays),
            'max': np.max(stacked_arrays),
            'attribute': attribute,
            'floor': floor
        }
    else:
        stats = {
            'cluster': cluster,
            'count': 0,
            'mean': np.nan,
            'std': np.nan,
            'min': np.nan,
            'max': np.nan,
            'attribute': attribute,
            'floor': floor
        }
    cluster_stats.append(stats)

stats_df = pd.DataFrame(cluster_stats)
stats_df.to_csv(dir+attribute+'_floor_'+str(floor)+'_cluster_statistics.csv', index=False)

# create a crosstab to show the number of each cluster in each room
crosstab = pd.crosstab(df['room_label'], df['cluster'], normalize='index') * 100
crosstab.to_csv(dir+attribute+'_floor_'+str(floor)+'_cluster_distribution.csv')
print("\nRoom-Cluster distribution saved to 'room_cluster_distribution.csv'")
print("Cluster statistics saved to 'cluster_statistics.csv'")

# extra feature: feature importance analysis
print("\nTime point feature importance analysis:")
for i, cluster in enumerate(clusters):
    if i < len(clusters) - 1:  # compare the current cluster with all other clusters
        cluster_data = df[df['cluster'] == cluster]
        other_data = df[df['cluster'] != cluster]
        
        cluster_arrays = []
        for arr in cluster_data['processed_dataset']:
            if len(arr) == ts_length:
                cluster_arrays.append(arr)
                
        other_arrays = []
        for arr in other_data['processed_dataset']:
            if len(arr) == ts_length:
                other_arrays.append(arr)
        
        if cluster_arrays and other_arrays:
            # calculate the difference between the current cluster and other clusters
            cluster_mean = np.mean(np.vstack(cluster_arrays), axis=0)
            other_mean = np.mean(np.vstack(other_arrays), axis=0)
            
            # calculate the standardized difference
            abs_diff = np.abs(cluster_mean - other_mean)
            total_std = np.sqrt(np.var(np.vstack(cluster_arrays), axis=0) + np.var(np.vstack(other_arrays), axis=0))
            importance = abs_diff / (total_std + 1e-10)  # avoid division by zero
            
            # find the top 5 most important time points
            top_indices = np.argsort(importance)[-5:][::-1]
            
            print(f"\nCluster {cluster} vs. other clusters:")
            print("  Most important time points:")
            for idx in top_indices:
                print(f"    Time point {idx}: importance = {importance[idx]:.4f}, cluster mean = {cluster_mean[idx]:.4f}, other cluster mean = {other_mean[idx]:.4f}")
            # save the data to csv file: TODO
            data = {
                'cluster': cluster,
                'time_point': top_indices,
                'importance': importance[top_indices]
            }
            
