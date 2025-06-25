import React, { useState } from "react";
import "../styles/map.css";
import { Layout } from "antd"; // Import Layout from antd
import Sidebar from "../components/Sidebar"; // Import Sidebar
import MapComponent from "../components/MapComponent"; // Adjust path accordingly

const { Header, Content } = Layout; // Destructure Layout

function MapView() {
  const [collapsed, setCollapsed] = useState(false); // Collapse state for Sidebar

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar Menu */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} /> {/* Sidebar on MapView */}

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="header">
          <h1>Map View</h1>
        </Header>

        {/* Content Section */}
        <Content style={{ margin: "16px" }}>
          <p>Add and view dark stores in your city.</p>

          {/* Map Component */}
          <MapComponent />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MapView;
