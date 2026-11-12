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
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
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

        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={label}
            className="max-h-[70vh] w-full object-contain"
          />

          <span className="absolute bottom-5 left-6 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            <FiZoomIn className="mr-1 inline" /> {code} Preview
          </span>
        </div>

        <div className="p-6">
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