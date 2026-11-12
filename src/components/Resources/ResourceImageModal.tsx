import { useEffect } from "react";
import { FiX, FiZoomIn } from "react-icons/fi";

type Props = {
  label: string;
  code: string;
  imageUrl: string;
  onClose: () => void;
};

export default function ResourceImageModal({ label, code, imageUrl, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#031837]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${label} preview`}
      onClick={onClose}
    >
      <div
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/20 bg-white shadow-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#031837]/80 text-xl text-white transition hover:bg-[#031837]"
        >
          <FiX />
        </button>

        <div className="relative flex h-[min(58vh,420px)] min-h-[220px] items-center justify-center overflow-hidden bg-slate-100 sm:h-[min(70vh,520px)]">
          <img
            src={imageUrl}
            alt={label}
            className="max-h-full w-full object-contain"
          />

          <span className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:bottom-5 sm:left-6 sm:text-xs sm:tracking-[0.16em]">
            <FiZoomIn className="mr-1 inline" /> {code} Preview
          </span>
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-light)]">
            Resource visual
          </p>
          <h3 className="mt-1 text-xl font-semibold text-[var(--color-accent)]">
            {label}
          </h3>
        </div>
      </div>
    </div>
  );
}