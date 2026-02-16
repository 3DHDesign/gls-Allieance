// src/App.tsx  (add the two routes)
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import FindForwarder from "./pages/FindForwarder";
import { Routes, Route } from "react-router-dom";
import EventsPage from "./pages/Events";
import MemberRegistration from "./pages/MemberRegistration";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ForwarderProfile from "./pages/ForwarderProfile";
import Resources from "./pages/Resources";
import Benefits from "./pages/Benefits";
import EventDetail from "./pages/EventDetail";

import LoginPage from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; 
import DashboardHome from "./pages/DashboardHome";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import AccountPage from "./pages/AccountPage";
import VerifyOtp from "./pages/VerifyOtp";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginPage />} /> 

        <Route path="/find-forwarder" element={<FindForwarder />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/member-registration" element={<MemberRegistration />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/forwarder/:id" element={<ForwarderProfile />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/dashboard" element={<DashboardHome />} />
<Route path="/profile" element={<ProfilePage />} />
<Route path="/payment" element={<PaymentPage />} /> 
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/reset-password" element={<ResetPassword />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
