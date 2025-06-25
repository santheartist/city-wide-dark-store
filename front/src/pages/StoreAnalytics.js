import React, { useState, useEffect } from "react";
import { Layout, Card, Row, Col, Statistic, Typography, Button, Input, Modal, Form, message } from "antd";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const { Header, Content } = Layout;
const { Title } = Typography;

function StoreAnalytics() {
  const [collapsed, setCollapsed] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalSales: 500000,
    ordersProcessed: 1250,
    returningCustomers: 45.8,
    topProducts: [
      { name: "Laptop", sales: 120 },
      { name: "Smartphone", sales: 200 },
      { name: "Headphones", sales: 90 },
    ],
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [newSales, setNewSales] = useState("");

  useEffect(() => {
    // You can simulate API calls here
    // setAnalyticsData(fetchAnalyticsData());
  }, []);

  const handleAddProduct = () => {
    if (newProduct && newSales) {
      setAnalyticsData((prev) => ({
        ...prev,
        topProducts: [...prev.topProducts, { name: newProduct, sales: parseInt(newSales) }],
      }));
      setNewProduct("");
      setNewSales("");
      setIsModalVisible(false);
      message.success("New product added successfully!");
    } else {
      message.error("Please enter product name and sales count.");
    }
  };

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales Over Time",
        data: [50000, 70000, 80000, 60000, 90000, 120000],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ transition: "margin-left 0.2s ease-in-out" }}>
        <Header className="header">
          <Title level={2} style={{ color: "white" }}>
            Store Analytics
          </Title>
        </Header>

        <Content style={{ margin: "16px" }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic title="Total Sales (₹)" value={analyticsData.totalSales} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Orders Processed" value={analyticsData.ordersProcessed} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Returning Customers (%)" value={analyticsData.returningCustomers} precision={1} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Card title="Sales Over Time">
                <Line data={chartData} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Card title="Top Selling Products">
                <ul>
                  {analyticsData.topProducts.map((product, index) => (
                    <li key={index}>
                      {product.name} — {product.sales} units
                    </li>
                  ))}
                </ul>
                <Button style={{ marginTop: "10px" }} onClick={() => setIsModalVisible(true)}>
                  Add Product
                </Button>
              </Card>
            </Col>
          </Row>

          <div className="dashboard-actions" style={{ marginTop: "20px" }}>
            <Button type="primary">
              <a href="/reports">View Reports</a>
            </Button>
            <Button style={{ marginLeft: "10px" }}>
              <a href="/manage-stores">Manage Stores</a>
            </Button>
          </div>
        </Content>
      </Layout>

      <Modal
        title="Add Top Selling Product"
        visible={isModalVisible}
        onOk={handleAddProduct}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form>
          <Form.Item label="Product Name">
            <Input value={newProduct} onChange={(e) => setNewProduct(e.target.value)} placeholder="Enter product name" />
          </Form.Item>
          <Form.Item label="Sales Count">
            <Input
              type="number"
              value={newSales}
              onChange={(e) => setNewSales(e.target.value)}
              placeholder="Enter sales count"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default StoreAnalytics;
