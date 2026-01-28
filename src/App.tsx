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

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-forwarder" element={<FindForwarder />} />
        {/* optional: fallback */}
        <Route path="*" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/member-registration" element={<MemberRegistration />} />
        <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/forwarder/:id" element={<ForwarderProfile />} />
      </Routes>
      <Footer />
    </>
  );
}
