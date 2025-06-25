import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "../styles/MapComponent.css";

// Haversine Formula to calculate distance between two lat/lng points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371 * 1000; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Custom marker icons
const storeIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const possibleStoreIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991116.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const MapComponent = () => {
    const [stores, setStores] = useState([]);
    const [possibleStores, setPossibleStores] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);
    const [clickCircle, setClickCircle] = useState(null);
    const [highlightedStore, setHighlightedStore] = useState(null);
    const [storeDetails, setStoreDetails] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/api/stores").then((response) => {
            setStores(response.data);
var    originalData  = response.data;
var n = 10;
            let newData = [];

            let currentId = originalData.length + 1;

            for (let i = 0; i < n; i++) {
                originalData.forEach(item => {
                    let newItem = { ...item }; // Copy object
                    newItem.id = currentId++; // Assign new ID
                    newItem.latitude = (parseFloat(item.latitude) + 0.02).toFixed(6); // Increase latitude
                    newItem.longitude = (parseFloat(item.longitude) + 0.02).toFixed(6); // Increase longitude
                    newItem.name = item.name + "_copy" + (i + 1); // Different name
                    newData.push(newItem);
                });
            }
            setPossibleStores(newData);
        });



        // axios.get("http://localhost:3000/api/possible-store").then((response) => {
        //     setPossibleStores(response.data);
        // });
    }, []);

    // Handle map click to find 3 nearest stores
    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                let radius = 500; // Start radius in meters
                let foundStores = [];

                const expandCircle = () => {
                    foundStores = stores
                        .map((store) => ({
                            ...store,
                            distance: haversineDistance(lat, lng, parseFloat(store.latitude), parseFloat(store.longitude)),
                        }))
                        .filter((store) => store.distance <= radius)
                        .sort((a, b) => a.distance - b.distance);

                    if (foundStores.length >= 3 || radius > 5000) {
                        setSelectedStores(foundStores.slice(0, 3));
                        return;
                    }

                    radius += 500;
                    setClickCircle({ lat, lng, radius });

                    setTimeout(expandCircle, 300);
                };

                setClickCircle({ lat, lng, radius });
                setSelectedStores([]); // Reset selected stores on new search
                setStoreDetails(null); // Reset store details
                expandCircle();
            },
        });

        return null;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <div style={{ display: "flex", flex: 1 }}>
                {/* Map Section */}
                <div style={{ width: "70%", height: "600px" }}>
                    <MapContainer center={[18.5204, 73.8567]} zoom={12} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
                        <MapClickHandler />

                        {/* Store Markers with Popup on Click */}
                        {stores.map((store) => (
                            <Marker
                                key={store.id}
                                position={[store.latitude, store.longitude]}
                                icon={storeIcon}
                                eventHandlers={{
                                    click: () => setStoreDetails(store),
                                }}
                            >
                                <Popup>
                                    <strong>{store.name}</strong>
                                    <br />
                                    Orders Served: {store.orders_served}
                                </Popup>
                            </Marker>
                        ))}

                        {/* Possible Store Markers */}
                        {possibleStores.map((store) => (
                            <Marker key={store.id} position={[store.latitude, store.longitude]} icon={possibleStoreIcon} />
                        ))}

                        {/* Expanding Circle on Click */}
                        {clickCircle && (
                            <Circle center={[clickCircle.lat, clickCircle.lng]} radius={clickCircle.radius} color="red" fillOpacity={0.3} />
                        )}

                        {/* Highlighted 3 Nearest Stores */}
                        {selectedStores.map((store) => (
                            <Circle
                                key={`selected-${store.id}`}
                                center={[store.latitude, store.longitude]}
                                radius={500}
                                color="green"
                                fillOpacity={0.4}
                            />
                        ))}

                        {/* Highlighted Store When Clicking on Card */}
                        {highlightedStore && (
                            <Circle
                                center={[highlightedStore.latitude, highlightedStore.longitude]}
                                radius={800}
                                color="blue"
                                fillOpacity={0.5}
                            />
                        )}
                    </MapContainer>
                </div>

                {/* Right Section: Store Info */}
                <div style={{ width: "30%", padding: "10px", overflowY: "auto", height: "600px", backgroundColor: "#f5f5f5", color: "black" }}>
                    <h3>📌 3 Nearest Stores</h3>
                    {selectedStores.map((store) => (
                        <div
                            key={store.id}
                            style={{ padding: "10px", marginBottom: "10px", backgroundColor: "white", cursor: "pointer", border: "1px solid #ddd" }}
                            onClick={() => setHighlightedStore(store)}
                        >
                            <strong>{store.name}</strong>
                            <br />
                            Address: {store.address}
                            <br />
                            Location: {store.latitude}, {store.longitude}
                            <br />
                            Orders Served: {store.orders_served}
                        </div>
                    ))}

                    {/* Selected Store Details on Click */}
                    {storeDetails && (
                        <div style={{ padding: "15px", marginTop: "20px", backgroundColor: "white", border: "1px solid #ddd" }}>
                            <h3>🏬 {storeDetails.name}</h3>
                            <p><strong>Address:</strong> {storeDetails.address}</p>
                            <p><strong>Location:</strong> {storeDetails.latitude}, {storeDetails.longitude}</p>
                            <p><strong>Orders Served:</strong> {storeDetails.orders_served}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Below Map: Possible Store Info */}
            <div style={{ width: "100%", padding: "10px", backgroundColor: "#e0e0e0", overflowX: "auto" }}>
                <h3>🏗 Possible Store Locations</h3>
                <div style={{ display: "flex", gap: "10px", overflowX: "scroll" }}>
                    {possibleStores.map((store) => (
                        <div
                            key={store.id}
                            style={{
                                padding: "10px",
                                backgroundColor: "white",
                                cursor: "pointer",
                                border: "1px solid #ddd",
                                minWidth: "200px",
                            }}
                            onClick={() => setHighlightedStore(store)}
                        >
                            <strong>{store.name}</strong>
                            <br />
                            Proposed Location: {store.latitude}, {store.longitude}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
