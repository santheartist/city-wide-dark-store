import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Layout, Tooltip, Divider, Typography } from "antd";
import { 
  DashboardOutlined, 
  EnvironmentOutlined, 
  BarChartOutlined, 
  LogoutOutlined, 
  UserOutlined, 
  ShopOutlined, 
  BarChartOutlined as StoreAnalyticsIcon 
} from "@ant-design/icons";

const { Sider } = Layout;
const { Title } = Typography;

function Sidebar({ collapsed, setCollapsed }) {
  const [selectedKey, setSelectedKey] = useState("1");

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const menuItems = [
    { key: "1", icon: <DashboardOutlined />, label: "Dashboard", to: "/dashboard" },
    { key: "2", icon: <EnvironmentOutlined />, label: "Map", to: "/map" },
    { key: "3", icon: <BarChartOutlined />, label: "Reports", to: "/reports" },
    { key: "7", icon: <StoreAnalyticsIcon />, label: "Store Analytics", to: "/store-analytics" },
    { key: "6", icon: <ShopOutlined />, label: "Manage Stores", to: "/manage-stores" },
    { key: "5", icon: <UserOutlined />, label: "Admin Profile", to: "/admin-profile" },
    { key: "4", icon: <LogoutOutlined />, label: "Logout", to: "/login", danger: true }
  ];

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ minHeight: "100vh" }}>
      <div className="logo" style={{ padding: "16px", textAlign: "center", color: "white" }}>
        {collapsed ? (
          <Tooltip title="Dark Store" placement="right">
            🏪
          </Tooltip>
        ) : (
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Dark Store
          </Title>
        )}
      </div>

      <Menu
        theme="dark"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        mode="inline"
      >
        <Divider style={{ background: "#ffffff20" }} />
        {menuItems.slice(0, 3).map(item => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.to}>{item.label}</Link>
          </Menu.Item>
        ))}
        <Divider style={{ background: "#ffffff20" }} />
        {menuItems.slice(3).map(item => (
          <Menu.Item key={item.key} icon={item.icon} danger={item.danger}>
            <Link to={item.to}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

export default Sidebar;
