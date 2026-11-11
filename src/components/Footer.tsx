// src/components/Footer.tsx

import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FiArrowUpRight, FiGlobe } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#031837] text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="container relative mx-auto px-4 py-14 md:py-18">
        <div className="mb-12 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-sm font-bold text-[#031837]">
              GLS
            </span>
            <div>
              <p className="text-lg font-semibold">Ready to grow globally?</p>
              <p className="mt-1 text-sm text-white/60">Join a trusted network built for meaningful connections.</p>
            </div>
          </div>
          <Link
            to="/member-registration"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-accent)] transition hover:bg-emerald-50"
          >
            Become a member
            <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_0.8fr_1.2fr] md:gap-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-3 rounded-xl bg-white p-2">
              <img src="/images/logo.png" alt="GLS Alliance" className="h-12 w-36 object-contain" />
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/65">
              A global logistics alliance connecting verified freight
              forwarders, exporters, and importers across international
              markets.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
              <FiGlobe />
              Connecting business worldwide
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-white">
                  About GLS Alliance
                </Link>
              </li>
              <li>
                <Link to="/find-forwarder" className="transition hover:text-white">
                  Find Freight Forwarder
                </Link>
              </li>
              <li>
                <Link to="/events" className="transition hover:text-white">
                  Events & Meetups
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Contact us
            </h3>
            <ul className="space-y-4 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-emerald-300" />
                <span>
                  30/1A, Wijayamangalarama Road,<br />
                  Kohuwala, Sri Lanka
                </span>
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-emerald-300" />
                <a
                  href="tel:+94112825147"
                  className="transition hover:text-white"
                >
                  +94 112 825147
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-emerald-300" />
                <a
                  href="tel:+94775286377"
                  className="transition hover:text-white"
                >
                  Hotline: +94 775 286 377
                </a>
              </li>

              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 shrink-0 text-emerald-300" />
                <div className="flex flex-col">
                  <a
                    href="mailto:jeewaka@glsalliance.com"
                    className="transition hover:text-white"
                  >
                    jeewaka@glsalliance.com
                  </a>
                  <a
                    href="mailto:glsalliance@outlook.com"
                    className="transition hover:text-white"
                  >
                    glsalliance@outlook.com
                  </a>
                </div>
              </li>

            </ul>
          </div>

        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} GLS Alliance Pvt Ltd. All rights reserved.</span>
          <span>Connecting people • Connecting businesses • Delivering solutions worldwide</span>
        </div>

      </div>
    </footer>
  );
}
