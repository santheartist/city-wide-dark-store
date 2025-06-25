import React, { useState } from "react";
import { Layout, Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/manageStores.css";

const { Content, Header } = Layout;
const { Option } = Select;

const ManageStores = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [stores, setStores] = useState([
    { key: "1", name: "Kothrud Store", location: "Kothrud, Pune", status: "Open", revenue: 120000 },
    { key: "2", name: "Viman Nagar Store", location: "Viman Nagar, Pune", status: "Closed", revenue: 80000 },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  
  // Handle Form Submission
  const handleFormSubmit = (values) => {
    if (editingStore) {
      const updatedStores = stores.map((store) => (store.key === editingStore.key ? { ...store, ...values } : store));
      setStores(updatedStores);
      message.success("Store updated successfully!");
    } else {
      const newStore = { ...values, key: (stores.length + 1).toString() };
      setStores([...stores, newStore]);
      message.success("New store added successfully!");
    }
    setIsModalVisible(false);
    setEditingStore(null);
  };

  // Handle Store Deletion
  const handleDelete = (key) => {
    const updatedStores = stores.filter((store) => store.key !== key);
    setStores(updatedStores);
    message.success("Store deleted successfully!");
  };

  // Open Add/Edit Modal
  const handleAddStore = () => {
    setEditingStore(null);
    setIsModalVisible(true);
  };

  const handleEditStore = (record) => {
    setEditingStore(record);
    setIsModalVisible(true);
  };

  const columns = [
    { title: "Store Name", dataIndex: "name", key: "name" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Revenue (₹)", dataIndex: "revenue", key: "revenue" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditStore(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure to delete this store?" onConfirm={() => handleDelete(record.key)} okText="Yes" cancelText="No">
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ transition: "margin-left 0.2s ease-in-out" }}>
        <Header className="header">
          <h2 style={{ color: "white" }}>Manage Stores</h2>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div className="manage-stores-container">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStore} className="add-store-btn">
              Add Store
            </Button>
            <Table dataSource={stores} columns={columns} className="store-table" />

            <Modal
              title={editingStore ? "Edit Store" : "Add New Store"}
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
            >
              <Form initialValues={editingStore || { status: "Open" }} onFinish={handleFormSubmit} layout="vertical">
                <Form.Item name="name" label="Store Name" rules={[{ required: true, message: "Please enter store name!" }]}>
                  <Input placeholder="Enter store name" />
                </Form.Item>
                <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter location!" }]}>
                  <Input placeholder="Enter location" />
                </Form.Item>
                <Form.Item name="status" label="Status">
                  <Select>
                    <Option value="Open">Open</Option>
                    <Option value="Closed">Closed</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="revenue" label="Revenue (₹)" rules={[{ required: true, message: "Please enter revenue!" }]}>
                  <Input type="number" placeholder="Enter revenue amount" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {editingStore ? "Update Store" : "Add Store"}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageStores;
