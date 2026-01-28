import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function AuthBox() {
  return (
    <div className="relative z-10 mx-auto -mt-10 max-w-5xl px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          
          {/* LOGIN */}
          <button
            className="group w-full py-6 px-10 flex flex-col items-center gap-2 transition 
                       hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)]
                       rounded-l-2xl"
          >
            <FaSignInAlt className="text-3xl text-blue-600 group-hover:text-[var(--color-primary)] group-hover:scale-105 transition" />
            <span className="text-base font-medium text-gray-800 group-hover:text-[var(--color-primary)]">
              Find a freight forwarder
            </span>
          </button>

          {/* SIGN UP */}
          <button
            className="group w-full py-6 px-10 flex flex-col items-center gap-2 transition 
                       hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)]
                       rounded-r-2xl"
          >
            <FaUserPlus className="text-3xl text-blue-600 group-hover:text-[var(--color-primary)] group-hover:scale-105 transition" />
            <span className="text-base font-medium text-gray-800 group-hover:text-[var(--color-primary)]">
              Become a WCAworld member
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}
