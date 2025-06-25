import React, { useState } from "react";
import { Layout, Card, Button, Divider, Table, message } from "antd";
import { LineChartOutlined, FileTextOutlined, PlusOutlined } from "@ant-design/icons";  // Removed unused imports
import Sidebar from "../components/Sidebar";
import "../styles/adminProfile.css";

const { Header, Content } = Layout;

const AdminProfile = () => {
  const [collapsed, setCollapsed] = useState(false); // Sidebar collapsed state

  // Sample admin data
  const adminData = {
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator",
    profilePicture: "https://via.placeholder.com/150", // Placeholder image
  };

  // Store data for management and reports
  const storeData = [
    { key: "1", storeName: "Kothrud Store", sales: 1200, location: "Kothrud, Pune", performance: "Good" },
    { key: "2", storeName: "Viman Nagar Store", sales: 850, location: "Viman Nagar, Pune", performance: "Average" },
    { key: "3", storeName: "Baner Store", sales: 1600, location: "Baner, Pune", performance: "Excellent" },
  ];

  // Store management table columns
  const storeColumns = [
    { title: "Store Name", dataIndex: "storeName", key: "storeName" },
    { title: "Sales (₹)", dataIndex: "sales", key: "sales" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Performance", dataIndex: "performance", key: "performance" },
  ];

  // Handle actions
  const handleAddStore = () => {
    message.success("Add Store feature coming soon!");
  };

  const handleDownloadReport = () => {
    message.success("Report downloaded successfully!");
  };

  const handleOptimizeStores = () => {
    message.success("AI Optimization in progress...");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? "80px" : "50px", transition: "margin-left 0.2s" }}>
        <Header className="header">
          <h1>Admin Profile</h1>
        </Header>

        {/* Content Section */}
        <Content style={{ margin: "16px", padding: "20px" }}>
          <div className="admin-profile">
            {/* Admin Info Card */}
            <Card className="profile-card">
              <div className="profile-header">
                <img src={adminData.profilePicture} alt="Profile" className="profile-img" />
                <div className="profile-info">
                  <h3>{adminData.name}</h3>
                  <p>{adminData.email}</p>
                  <p><strong>Role:</strong> {adminData.role}</p>
                </div>
              </div>
            </Card>

            {/* Store Management Section */}
            <Card title="Store Management" className="management-card">
              <Button icon={<PlusOutlined />} type="primary" style={{ marginBottom: "10px" }} onClick={handleAddStore}>
                Add New Store
              </Button>
              <Divider />
              <Table columns={storeColumns} dataSource={storeData} pagination={{ pageSize: 5 }} />
            </Card>

            {/* Reports Section */}
            <Card title="Reports & Analytics" className="reports-card">
              <Button icon={<FileTextOutlined />} type="default" style={{ marginBottom: "10px" }} onClick={handleDownloadReport}>
                Download Full Report
              </Button>
              <Divider />
              <Table columns={storeColumns} dataSource={storeData} pagination={false} />
            </Card>

            {/* AI Insights Section */}
            <Card title="AI Insights" className="ai-insights-card">
              <Button icon={<LineChartOutlined />} type="dashed" style={{ marginBottom: "10px" }} onClick={handleOptimizeStores}>
                Optimize Store Network
              </Button>
              <Divider />
              <div className="ai-insights-text">
                <p>AI-driven store optimization recommendations will appear here. Analyze store performance and get data-backed insights.</p>
              </div>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminProfile;
