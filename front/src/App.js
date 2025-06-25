import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import AdminProfile from "./pages/AdminProfile";
import StoreAnalytics from "./pages/StoreAnalytics";
import ManageStores from "./pages/ManageStores";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/store-analytics" element={<StoreAnalytics />} />
        <Route path="/manage-stores" element={<ManageStores />} />
      </Routes>
    </Router>
  );
}

export default App;
