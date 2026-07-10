import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ==========================================
// 1. IMPORTING ALL PAGES
// ==========================================
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import SymptomTracker from './pages/SymptomTracker';
import SymptomHistory from './pages/SymptomHistory';
import TrendsGraph from './pages/TrendsGraph';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import BookingConfirm from './pages/BookingConfirm';
import VideoConsult from './pages/VideoConsult';
import PrescriptionView from './pages/PrescriptionView';
import HormoneTestOrder from './pages/HormoneTestOrder';
import LabReport from './pages/LabReport';
import CarePlan from './pages/CarePlan';
import WeeklyCheckIn from './pages/WeeklyCheckIn';
import Community from './pages/Community';
import ThreadDetail from './pages/ThreadDetail';
import ExpertAMA from './pages/ExpertAMA';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SubscriptionBox from './pages/SubscriptionBox';
import Checkout from './pages/Checkout';
import CorporateDashboard from './pages/CorporateDashboard';
import AggregateInsights from './pages/AggregateInsights';
import Profile from './pages/Profile';
import LandingPage from './pages/landing';

// ==========================================
// 2. MAIN APP ROUTER
// ==========================================
function App() {
  return (
    <Router>
      <Routes>
        {/* Core Flow */}
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Health & Tracking */}
        <Route path="/symptom-tracker" element={<SymptomTracker />} />
        <Route path="/symptom-history" element={<SymptomHistory />} />
        <Route path="/trends-graph" element={<TrendsGraph />} />
        <Route path="/care-plan" element={<CarePlan />} />
        <Route path="/weekly-checkin" element={<WeeklyCheckIn />} />

        {/* Telehealth & Doctors */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/booking-confirm" element={<BookingConfirm />} />
        <Route path="/video-consult" element={<VideoConsult />} />
        <Route path="/prescription/:id" element={<PrescriptionView />} />
        
        {/* Lab Tests */}
        <Route path="/hormone-test" element={<HormoneTestOrder />} />
        <Route path="/lab-report" element={<LabReport />} />

        {/* Community */}
        <Route path="/community" element={<Community />} />
        <Route path="/thread/:id" element={<ThreadDetail />} />
        <Route path="/expert-ama" element={<ExpertAMA />} />

        {/* E-Commerce & Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/subscription" element={<SubscriptionBox />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* B2B / Corporate Dashboard */}
        <Route path="/corporate-dashboard" element={<CorporateDashboard />} />
        <Route path="/aggregate-insights" element={<AggregateInsights />} />
      </Routes>
    </Router>
  );
}

export default App;