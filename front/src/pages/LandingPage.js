// LandingPage.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      {/* Header */}
      <header className="landing-container">
        <h1>LocalLogix – Dark Store Optimization Platform</h1>
        <p>Revolutionize delivery efficiency with AI-driven insights and precision planning.</p>
        <Link to="/login">
          <button className="start-btn">Get Started</button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>AI-Powered Dark Store Network Optimization</h1>
          <p>
            Leverage advanced machine learning models to optimize dark store placement, forecast demand,
            and create dynamic delivery zones for real-time operational efficiency.
          </p>
          {/* <Link to="/login" className="btn-cta">
            Get Started
          </Link> */}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Platform Capabilities</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>AI-Driven Store Placement</h3>
            <p>
              Utilize K-Means clustering to identify optimal store locations based on real-time demand data.
            </p>
          </div>

          <div className="feature-card">
            <h3>Dynamic Service Zones</h3>
            <p>
              Design adaptable delivery zones using Voronoi algorithms, ensuring faster deliveries and reduced overlap.
            </p>
          </div>

          <div className="feature-card">
            <h3>Advanced Demand Forecasting</h3>
            <p>
              Predict future order volumes with LSTM and ARIMA models, empowering proactive supply chain decisions.
            </p>
          </div>

          <div className="feature-card">
            <h3>Geospatial Visualization</h3>
            <p>
              Analyze store performance and demand distribution on interactive, real-time maps powered by Leaflet.js.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>Why LocalLogix ?</h2>
        <p>
          Our cutting-edge solution helps quick commerce platforms like Blinkit optimize dark store networks,
          reduce last-mile delivery times, and make data-driven decisions using machine learning.
        </p>
        <p>
          Unlock operational excellence by combining real-time analytics with advanced AI models for future-proof logistics.
        </p>
      </section>

      {/* Call to Action */}
      <section id="cta" className="cta-section">
        <h2>Ready to Optimize Your Dark Store Network?</h2>
        <p>Accelerate delivery performance and gain a competitive edge with our AI-powered solution.</p>
      </section>
      <Footer />

    </div>
  );
};

export default LandingPage;
