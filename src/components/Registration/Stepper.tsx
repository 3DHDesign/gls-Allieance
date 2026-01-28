import {
  FiPackage, FiFileText , FiSettings, FiShield, FiCheckSquare
} from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa";

const ICONS = [
  FiPackage,        // Profile Type
  FaRegBuilding,    // Company Information
  FiFileText,       // Business Registration
  FiPackage,              // Membership Details
  FiSettings,       // Services & Activities
  FiShield,         // Insurance Information
  FiCheckSquare,    // Submit
];

export default function Stepper({
  steps, current, onJump,
}: {
  steps: string[];
  current: number;
  onJump: (i: number) => void;
}) {
  const segments = Math.max(steps.length - 1, 0);
  const ratio = segments > 0 ? current / segments : 0;
  const pad = 50;

  return (
    <div className="container mt-8 mb-6 px-4 pb-4">
      <div className="relative">
        <div
          className="absolute h-1 bg-gray-200 rounded"
          style={{ left: `${pad}px`, right: `${pad}px`, top: "22px" }}
        />

        <div
          className="absolute h-1 bg-blue-500 rounded transition-all duration-300"
          style={{
            left: `${pad}px`,
            width: `calc((100% - ${pad * 2}px) * ${ratio})`,
            top: "22px",
          }}
        />

        <ol className="flex justify-between items-start relative">
          {steps.map((label, i) => {
            const Icon = ICONS[i] || FiCheckSquare;
            const active = i === current;
            const passed = i < current;
            const upcoming = i > current;

            return (
              <li key={label} className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => onJump(i)}
                  className={`
                    flex items-center justify-center
                    h-12 w-12 rounded-full border-2 transition-all duration-300
                    ${active
                      ? "bg-blue-500 text-white border-blue-500 scale-110"
                      : passed
                      ? "bg-green-100 text-green-600 border-green-500"
                      : "bg-white text-gray-400 border-gray-300"}
                    ${upcoming ? "hover:border-blue-300 hover:text-gray-600" : ""}
                  `}
                  title={label}
                >
                  {passed ? <FiCheckSquare className="text-lg text-green-600" /> : <Icon className="text-lg" />}
                </button>

                <div
                  className={`mt-3 text-xs font-medium text-center max-w-[100px] leading-tight
                    ${active ? "text-blue-600 font-semibold" : passed ? "text-green-600" : "text-gray-500"}`}
                >
                  {label}
                </div>

                <div
                  className={`absolute -bottom-6 text-xs font-medium
                    ${active ? "text-blue-600" : passed ? "text-green-600" : "text-gray-400"}`}
                >
                  {i + 1}/{steps.length}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
