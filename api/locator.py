from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.cluster import KMeans
from geopy.distance import great_circle
import pandas as pd

app = FastAPI()

# 🚚 Dummy customer delivery data (lat, long)
order_data = pd.DataFrame({
    "latitude": [18.5204, 18.5211, 18.5256, 18.5312, 18.5330],
    "longitude": [73.8567, 73.8572, 73.8509, 73.8492, 73.8480]
})

# 🏢 Existing dark store locations
existing_stores = [
    {"latitude": 18.5204, "longitude": 73.8567},
    {"latitude": 18.5312, "longitude": 73.8492}
]

# 📩 Request model
class StoreRequest(BaseModel):
    n_clusters: int
    min_distance_km: float


# 📍 API to suggest new store locations
@app.post("/suggest-new-stores")
async def suggest_new_stores(request: StoreRequest):
    if request.n_clusters <= 0 or request.min_distance_km <= 0:
        return {"error": "Number of clusters and minimum distance must be positive values."}

    # Fit KMeans to find cluster centers
    kmeans = KMeans(n_clusters=request.n_clusters, random_state=42)
    order_data['cluster'] = kmeans.fit_predict(order_data[['latitude', 'longitude']])
    new_locations = kmeans.cluster_centers_

    # 🧠 Filter out locations too close to existing stores
    final_locations = []
    for lat, lon in new_locations:
        is_far_enough = all(
            great_circle((lat, lon), (store['latitude'], store['longitude'])).km >= request.min_distance_km
            for store in existing_stores
        )
        if is_far_enough:
            final_locations.append({"latitude": lat, "longitude": lon})

    if not final_locations:
        return {"message": "No new suitable locations found based on the given distance."}

    return {"new_store_locations": final_locations}


