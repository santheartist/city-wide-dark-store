import React, { useState, useEffect } from "react";
import { Layout, Card, Row, Col, Statistic, Typography, Button, Input, Modal, Form, message, Spin } from "antd";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Line } from 'react-chartjs-2';
import axios from "axios";
import "../styles/dashboard.css";

const { Header, Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [storeData, setStoreData] = useState({
    totalStores: 0,
    totalRevenue: 0,
    highDemandPlaces: [],
    revenueTrend: [], // Ensure this exists in the state
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for fetching data

  // Fetch store data from API
  const fetchStoreData = async () => {
    setLoading(true); // Set loading state true
    try {
      // Fetch total store count from the new endpoint
      const storeCountResponse = await axios.get("http://localhost:5000/api/stores/count");
      const storeCount = storeCountResponse.data.totalStores;

      // Fetch other store data like revenue and high demand places
      const storeDetailsResponse = await axios.get("http://localhost:5000/api/stores");
      setStoreData({
        totalStores: storeCount,
        totalRevenue: storeDetailsResponse.data.totalRevenue,
        highDemandPlaces: storeDetailsResponse.data.highDemandPlaces || [],
        revenueTrend: storeDetailsResponse.data.revenueTrend || [], // Ensure revenueTrend exists
      });
      setRevenue(storeDetailsResponse.data.totalRevenue);
    } catch (error) {
      console.error("Error fetching store data:", error);
      message.error("Failed to load store data");
    } finally {
      setLoading(false); // Set loading state false after the data is fetched
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const handleAddPlace = async () => {
    if (newPlace) {
      try {
        await axios.post("http://localhost:5000/api/add-place", { place: newPlace });
        message.success("New place added successfully!");
        fetchStoreData(); // Refresh data
        setNewPlace("");
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error adding new place:", error);
        message.error("Failed to add new place");
      }
    } else {
      message.error("Please enter a place name.");
    }
  };

  const handleRevenueChange = async () => {
    const numericRevenue = parseFloat(revenue);
    if (isNaN(numericRevenue)) {
      message.error("Please enter a valid revenue value.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/update-revenue", { revenue: numericRevenue });
      message.success("Revenue updated successfully!");
      fetchStoreData();
    } catch (error) {
      console.error("Error updating revenue:", error);
      message.error("Failed to update revenue");
    }
  };

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: 'Revenue Over Time',
        data: storeData.revenueTrend || [], // Ensure this is an array
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header className="header">
          <Title level={2} style={{ color: "white" }}>
            Dark Store Dashboard
          </Title>
        </Header>
        <Content style={{ margin: "16px" }}>
          {loading ? (
            <Spin size="large" /> // Display loading spinner while fetching data
          ) : (
            <>
              <Row gutter={16}>
                <Col span={8}>
                  <Card>
                    <Statistic title="Total Stores" value={storeData.totalStores} suffix="stores" />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic title="Total Revenue" value={revenue} prefix="₹" precision={2} />
                    <Input
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      style={{ marginTop: "10px" }}
                      placeholder="Update Revenue"
                    />
                    <Button onClick={handleRevenueChange} style={{ marginTop: "10px" }}>Update Revenue</Button>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic title="High Demand Places" value={(storeData.highDemandPlaces || []).join(", ")} />
                    <Button style={{ marginTop: "10px" }} onClick={() => setIsModalVisible(true)}>
                      Add Place
                    </Button>
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <Card title="Revenue Over Time">
                    <Line data={chartData} />
                  </Card>
                </Col>
              </Row>
              <div className="dashboard-actions" style={{ marginTop: "20px" }}>
                <Link to="/map"><button className="btn">View Map</button></Link>
                <Link to="/reports"><button className="btn">View Reports</button></Link>
              </div>
            </>
          )}
        </Content>
      </Layout>
      <Modal
        title="Add High Demand Place"
        visible={isModalVisible}
        onOk={handleAddPlace}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form>
          <Form.Item label="Place Name">
            <Input
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              placeholder="Enter place name"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Dashboard;
