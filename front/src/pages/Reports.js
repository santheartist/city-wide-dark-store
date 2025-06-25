import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import "../styles/reports.css";

const { Header, Content } = Layout;



const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  text: { marginBottom: 5 },
  bulletPoint: { marginLeft: 10, marginBottom: 3 }
});

const BusinessInsightsReport = () => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.header}>Business Insights Report</Text>
      
      <Text style={pdfStyles.sectionTitle}>Understanding the User's Request</Text>
      <Text style={pdfStyles.text}>
        The user clicked on a specific location (37.7749, -122.4194) and wants insights on:
      </Text>
      <View>
        <Text style={pdfStyles.bulletPoint}>• Optimal new store locations within a 10km radius.</Text>
        <Text style={pdfStyles.bulletPoint}>• Evaluation of suggested store locations.</Text>
        <Text style={pdfStyles.bulletPoint}>• Impact on delivery times, load distribution, and traffic.</Text>
        <Text style={pdfStyles.bulletPoint}>• Business implications for efficiency and customer satisfaction.</Text>
      </View>
      
      <Text style={pdfStyles.sectionTitle}>Nearby Stores Analysis</Text>
      <View>
        <Text style={pdfStyles.text}>🔹 Store A (2.5 km away)</Text>
        <Text style={pdfStyles.bulletPoint}>Capacity: High</Text>
        <Text style={pdfStyles.bulletPoint}>Orders Served: 5000/month</Text>
        <Text style={pdfStyles.bulletPoint}>Traffic Density: 75%</Text>
        <Text style={pdfStyles.bulletPoint}>Avg. Delivery Time: 30 mins</Text>
        <Text style={pdfStyles.bulletPoint}>Recommendation: Consider expansion.</Text>
      </View>
      
      <View>
        <Text style={pdfStyles.text}>🔹 Store B (5.8 km away)</Text>
        <Text style={pdfStyles.bulletPoint}>Capacity: Medium</Text>
        <Text style={pdfStyles.bulletPoint}>Orders Served: 3200/month</Text>
        <Text style={pdfStyles.bulletPoint}>Traffic Density: 60%</Text>
        <Text style={pdfStyles.bulletPoint}>Avg. Delivery Time: 35 mins</Text>
        <Text style={pdfStyles.bulletPoint}>Recommendation: Monitor load.</Text>
      </View>
      
      <Text style={pdfStyles.sectionTitle}>Predicted Delivery Times</Text>
      <Text style={pdfStyles.text}>📍 Store ID 101: 28 mins</Text>
      <Text style={pdfStyles.text}>📍 Store ID 102: 32 mins</Text>
      
      <Text style={pdfStyles.sectionTitle}>Suggested New Store Locations</Text>
      <Text style={pdfStyles.text}>📍 Lat: 37.7800, Lon: -122.4200</Text>
      <Text style={pdfStyles.text}>📍 Lat: 37.7900, Lon: -122.4100</Text>
      
      <Text style={pdfStyles.sectionTitle}>Business Insights</Text>
      <Text style={pdfStyles.text}>
        Expanding within the suggested locations could reduce average delivery times by 15% and improve customer 
        satisfaction scores by 20% over the next quarter. Higher demand in the northern region suggests prioritizing 
        that area for a new store.
      </Text>
    </Page>
  </Document>
);


// Main Reports Component
const Reports = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? "80px" : "50px" }}>
        <Header className="header" style={{ padding: "0 20px" }}>
          <h1>Reports</h1>
        </Header>
        <Content style={{ margin: "16px", padding: "20px" }}>
          <p>Download the business insights report.</p>
          <PDFDownloadLink
            document={<BusinessInsightsReport />}
            fileName="business_insights_report.pdf"
          >
            {({ loading }) =>
              loading ? "Generating PDF..." : "Download Business Insights PDF"
            }
          </PDFDownloadLink>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Reports;
