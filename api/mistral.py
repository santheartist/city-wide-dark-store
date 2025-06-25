import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from geopy.distance import geodesic
import google.generativeai as genai
import mysql.connector
import joblib
from dotenv import load_dotenv
import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)



# Load the .env file
load_dotenv()

# Configure Gemini API securely
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

CORS(app, resources={"origins": "http://localhost:3000"})


app = FastAPI()




class UserLocation(BaseModel):
    latitude: float
    longitude: float
    n_clusters: int
    min_distance_km: float

# MySQL connection
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "hackron"
}

# Load trained KMeans model
kmeans_model = joblib.load("kmeans_model.pkl")

def get_nearby_stores(lat, lng, radius):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT id, name, latitude, longitude, capacity, orders_served, traffic_density, historical_avg_delivery_time,
        (6371 * ACOS(COS(RADIANS(%s)) * COS(RADIANS(latitude)) * 
        COS(RADIANS(longitude) - RADIANS(%s)) + 
        SIN(RADIANS(%s)) * SIN(RADIANS(latitude)))) AS distance
    FROM store1
    HAVING distance <= %s
    ORDER BY distance;
    """

    cursor.execute(query, (lat, lng, lat, radius))
    stores = cursor.fetchall()
    conn.close()

    return stores

@app.post("/analyze-impact")
async def analyze_impact(user_loc: UserLocation):
    stores = get_nearby_stores(user_loc.latitude, user_loc.longitude, user_loc.min_distance_km)

    if not stores:
        return {"error": "No stores found within the given radius"}

    # Calculate delivery times
    predictions = []
    for store in stores:
        predicted_time = store['historical_avg_delivery_time'] + (store['traffic_density'] * 5)
        predictions.append({"store_id": store['id'], "predicted_time": predicted_time})

    # Extract store coordinates for clustering
    store_coords = np.array([(store['latitude'], store['longitude']) for store in stores])

    if store_coords.shape[0] < 2:
        return {"error": "Not enough store data for clustering"}

    # Set the correct number of clusters
    num_clusters = min(len(stores), user_loc.n_clusters)
    kmeans_model.set_params(n_clusters=num_clusters)
    kmeans_model.fit(store_coords)

    new_store_coords = kmeans_model.cluster_centers_.tolist()

    # Analyze store load
    analyzed_stores = []
    for store in stores:
        recommendation = ""

        if store['traffic_density'] > 7 and store['orders_served'] >= 0.9 * store['capacity']:
            recommendation = "🚩 High demand! Consider opening a new store nearby."
        elif store['traffic_density'] < 3:
            recommendation = "🟢 Low traffic area — might not need a new store immediately."
        else:
            recommendation = "🔍 Moderate demand — consider future expansion."

        analyzed_stores.append({**store, "recommendation": recommendation})

    # Generate business insights using Gemini API
    insights_prompt = f"""
    A user clicked on coordinates ({user_loc.latitude}, {user_loc.longitude}).
    
    1. Identify optimal new store locations within a {user_loc.min_distance_km} km radius.
    2. Suggested store locations: {new_store_coords}.
    3. Impact on:
       - Delivery times: {predictions}
       - Load distribution & traffic density
    4. Business-level insights for operational efficiency and customer satisfaction.
    """

    insight_response = genai.GenerativeModel('models/gemini-2.0-flash-thinking-exp-1219').generate_content(insights_prompt)

    if insight_response and hasattr(insight_response, 'text'):
        business_insights = insight_response.text
    else:
        business_insights = "⚠️ Could not generate insights at this time."

    return {
        "nearby_stores": analyzed_stores,
        "predicted_delivery_times": predictions,
        "suggested_new_store_locations": new_store_coords,
        "business_insights": business_insights
    }
