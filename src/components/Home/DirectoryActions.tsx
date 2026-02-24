import {
  FaShip,
  FaHandshake,
  FaUserPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DirectoryActions() {
  return (
    <div className="relative z-10 mx-auto -mt-10 max-w-5xl px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-200">

          {/* FIND FREIGHT FORWARDER */}
          <Link
            to="/find-forwarder"
            className="group w-full py-6 px-8 flex flex-col items-center gap-2 transition
                       hover:bg-[var(--color-accent)]
                       rounded-l-2xl"
          >
            <FaShip className="text-3xl text-blue-600 group-hover:text-white group-hover:scale-105 transition" />
            <span className="text-base font-medium text-gray-800 group-hover:text-white text-center">
              Find Freight Forwarder
            </span>
          </Link>

          {/* FIND EXPORTER / IMPORTER */}
          <Link
            to="/find-exporter"
            className="group w-full py-6 px-8 flex flex-col items-center gap-2 transition
                       hover:bg-[var(--color-accent)]"
          >
            <FaHandshake className="text-3xl text-blue-600 group-hover:text-white group-hover:scale-105 transition" />
            <span className="text-base font-medium text-gray-800 group-hover:text-white text-center">
              Find Exporter / Importer
            </span>
          </Link>

          {/* BECOME GLS ALLIANCE MEMBER */}
          <Link
            to="/member-registration"
            className="group w-full py-6 px-8 flex flex-col items-center gap-2 transition
                       hover:bg-[var(--color-accent)]
                       rounded-r-2xl"
          >
            <FaUserPlus className="text-3xl text-blue-600 group-hover:text-white group-hover:scale-105 transition" />
            <span className="text-base font-medium text-gray-800 group-hover:text-white text-center">
              Become a GLS Alliance Member
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}
