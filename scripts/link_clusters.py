import sys
from collections import defaultdict
from os.path import isfile
import json
import requests

def get_features(restaurants):
    features = {}
    for r in restaurants:
        for f in r["features"]:
            _id = f["id"]
            if _id in features:
                assert f["title"] == features[_id]
            else:
                features[_id] = f["title"]

    features_ret = list(features.values())
    fmap = {i: j for i, j in zip(features.keys(), range(len(features_ret)))}

    return features_ret, fmap


def get_cities(restaurants):
    cities = defaultdict(list)
    for r in restaurants:
        city = r["address"].split(", ")[-1]

        # handle broken Ljubljana - Polje stuff
        if "Ljubljana" in city:
            city = "Ljubljana"

        r["city"] = city
        r["address"] = ",".join(r["address"].split(",")[:-1])

        cities[city].append([float(i) for i in r["coordinates"]])

    cities_ret = []
    for city in sorted(cities.keys()):
        coor = cities[city]
        c0 = [c[0] for c in coor]
        c1 = [c[1] for c in coor]
        cities_ret.append((city, (sum(c0)/len(c0), sum(c1)/len(c1))))

    for r in restaurants:
        r["city"] = [i for i, (c, _) in enumerate(cities_ret) if c == r["city"]][0]

    return restaurants, cities_ret


def minify(restaurants):
    features, fmap = get_features(restaurants)
    restaurants, cities = get_cities(restaurants)

    min_rs = []
    for r in restaurants:
        # Handle price
        price = r["price"]
        assert(price.split(" ")[-1] == "EUR")
        price = float(price.split(" ")[0].replace(",", "."))
        r["price"] = price

        # Handle coordinate system
        coor = r["coordinates"]
        coor = [float(coor[0]), float(coor[1])]
        r["coordinates"] = coor

        # Handle features
        r["features"] = [fmap[f["id"]] for f in r["features"]]

        # We dont really need ids
        del r["id"]

        # return
        min_rs.append(r)

    return {
        "restaurants": min_rs,
        "cities": cities,
        "features": features
    }

if __name__ == '__main__':
    if not 2 <= len(sys.argv) <= 3:
        print(
            "Usage: minifier.py <output_path> [True/False] \n \
            Last one is for plotting, default False"
        )
        sys.exit(1)

    plotting = len(sys.argv) == 3 and sys.argv[2] == "True"
    f_out = sys.argv[1]

    if isfile(f_out):
        print("Output file already exists!")
        sys.exit(0)
    
    req = requests.get("http://bonar.si/api/restaurants")
    if req.status_code >= 400:
        print("Could not download data.")
        sys.exit(1)
    
    restaurants = json.loads(req.text)
    to_ret = minify(restaurants)

    with open(f_out, "w") as fp:
        json.dump(to_ret, fp, ensure_ascii=False, separators=(',', ':'))
