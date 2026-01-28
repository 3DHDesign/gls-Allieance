import { FiMapPin } from "react-icons/fi";
import type { Forwarder } from "../../utils/forwarders";
import { Link } from "react-router-dom";

export default function ResultRow({ f }: { f: Forwarder }) {
  return (
    <Link
      to={`/forwarder/${f.id}`}
      className="container w-full block rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition px-4 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        {/* left: name + location */}
        <div className="min-w-0">
          <div className="truncate text-base md:text-lg font-medium text-gray-900">
            {f.name}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted">
            <FiMapPin className="opacity-70" />
            <span>{f.city}, {f.country}</span>
            {typeof f.years === "number" && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {f.years} {f.years === 1 ? "year" : "years"}
              </span>
            )}
          </div>
        </div>

        {/* right: tags (chips) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {(f.tags ?? []).map((t) => (
            <span key={t} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
