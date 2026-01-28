// src/components/Footer.tsx

import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-accent)] text-white">
      <div className="container mx-auto px-4 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              GLS Alliance Pvt Ltd
            </h2>
            <p className="text-white/80 leading-relaxed">
              A global logistics alliance connecting verified freight
              forwarders, exporters, and importers across international
              markets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About GLS Alliance
                </Link>
              </li>
              <li>
                <Link to="/find-forwarder" className="hover:text-white transition">
                  Find Freight Forwarder
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Information
            </h3>

            <ul className="space-y-4 text-white/80">

              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-white" />
                <span>
                  30/1A, Wijayamangalarama Road,<br />
                  Kohuwala, Sri Lanka
                </span>
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt />
                <a
                  href="tel:+94112825147"
                  className="hover:text-white transition"
                >
                  +94 112 825147
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt />
                <a
                  href="tel:+94775286377"
                  className="hover:text-white transition"
                >
                  Hotline: +94 775 286 377
                </a>
              </li>

              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1" />
                <div className="flex flex-col">
                  <a
                    href="mailto:jeewaka@glsalliance.com"
                    className="hover:text-white transition"
                  >
                    jeewaka@glsalliance.com
                  </a>
                  <a
                    href="mailto:glsalliance@outlook.com"
                    className="hover:text-white transition"
                  >
                    glsalliance@outlook.com
                  </a>
                </div>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-white/70">
          © {new Date().getFullYear()} GLS Alliance Pvt Ltd. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
