import json
from collections import defaultdict

import numpy as np
from sklearn.cluster import dbscan
from matplotlib import pyplot as plt
import sys
from os.path import isfile

plotting = False

if not 3 <= len(sys.argv) <= 4:
    print(
        "Usage: restaurant_linkage.py <path_to_restaurants.json> <output_path> [True/False] \n \
        Last one is for plotting, default False"
    )
    sys.exit(1)

plotting = len(sys.argv) == 4 and sys.argv[3] == "True"
f_in = sys.argv[1]
f_out = sys.argv[2]

if isfile(f_out):
    print("Output file already exists!")
    sys.exit(0)

if not isfile(f_in):
    print("Input file does not exist!")
    sys.exit(1)


with open(f_in) as fp:
    restaurants = json.load(fp)

coordinates = [[float(c["coordinates"][0]), float(c["coordinates"][1])] for c in restaurants]
carr = np.array(coordinates)
samples, labels = dbscan(carr, 0.05, min_samples=2)

if plotting:
    colors = ["#61615A", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941",
              "#006FA6", "#A30059", "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC",
              "#B79762", "#004D43", "#8FB0FF", "#997D87", "#5A0007", "#809693",
              "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
              "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA",
              "#D16100", "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018",
              "#0AA6D8", "#013349", "#00846F", "#372101", "#FFB500", "#C2FFED",
              "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09", "#00489C"]
    for i in range(len(restaurants)):
        clr, style = ("#000000", "*") if labels[i] < 0 else (colors[labels[i]], 'o')
        plt.plot(carr[i, 0], carr[i, 1], style, color=clr)
    plt.show()

clusters = defaultdict(list)
for i, l in enumerate(labels):
    clusters[l].append((
        restaurants[i]["coordinates"],
        restaurants[i]["address"].split(",")[-1][1:],
        restaurants[i]["id"]
    ))

clusters_filtered = {}
for c in clusters[-1]:
    clusters_filtered[c[1]] = {
        "latlon": (float(c[0][0]), float(c[0][1])),
        "ids": [c[2]]
    }

clusters.pop(-1)
for _, cluster in clusters.items():
    longitudes = [float(c[0][0]) for c in cluster]
    latitudes = [float(c[0][1]) for c in cluster]

    lon = sum(longitudes)/len(longitudes)
    lat = sum(latitudes)/len(latitudes)

    names = list(set([c[1] for c in cluster]))
    # Drgac mas Ljubljana - Polje,...
    if "Ljubljana" in names:
        names = ["Ljubljana"]
    name = ", ".join(names)

    assert(name not in clusters_filtered)
    clusters_filtered[name] = {
        "latlon": (lon, lat),
        "ids": [c[2] for c in cluster]
    }

with open(f_out, "w") as fp:
    json.dump(clusters_filtered, fp, ensure_ascii=False)

