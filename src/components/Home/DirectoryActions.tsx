import { FaShip, FaHandshake, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DirectoryActions() {
  return (
    <div className="relative z-10 mx-auto -mt-10 max-w-5xl px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Mobile: stack (divide-y) | Desktop: 3 cols (divide-x) */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* FIND FREIGHT FORWARDER */}
          <Link
            to="/find-forwarder"
            className="group w-full py-5 sm:py-6 px-5 sm:px-8
                       flex items-center md:flex-col md:items-center
                       gap-3 md:gap-2 transition
                       hover:bg-[var(--color-accent)]
                       md:rounded-l-2xl"
          >
            <FaShip className="text-3xl text-[var(--color-accent)] group-hover:text-white group-hover:scale-105 transition" />

            <span className="text-[15px] sm:text-base font-medium text-gray-800 group-hover:text-white">
              Find Freight Forwarder
            </span>
          </Link>

          {/* FIND EXPORTER / IMPORTER */}
          <Link
            to="/find-exporter"
            className="group w-full py-5 sm:py-6 px-5 sm:px-8
                       flex items-center md:flex-col md:items-center
                       gap-3 md:gap-2 transition
                       hover:bg-[var(--color-accent)]"
          >
            <FaHandshake className="text-3xl text-[var(--color-accent)] group-hover:text-white group-hover:scale-105 transition" />

            <span className="text-[15px] sm:text-base font-medium text-gray-800 group-hover:text-white">
              Find Exporter / Importer
            </span>
          </Link>

          {/* BECOME GLS ALLIANCE MEMBER */}
          <Link
            to="/member-registration"
            className="group w-full py-5 sm:py-6 px-5 sm:px-8
                       flex items-center md:flex-col md:items-center
                       gap-3 md:gap-2 transition
                       hover:bg-[var(--color-accent)]
                       md:rounded-r-2xl"
          >
            <FaUserPlus className="text-3xl text-[var(--color-accent)] group-hover:text-white group-hover:scale-105 transition" />

            <span className="text-[15px] sm:text-base font-medium text-gray-800 group-hover:text-white">
              Become a GLS Alliance Member
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}