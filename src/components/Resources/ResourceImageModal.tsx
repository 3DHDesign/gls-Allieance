import { FiX, FiZoomIn } from "react-icons/fi";

type Props = {
  label: string;
  code: string;
  onClose: () => void;
};

export default function ResourceImageModal({ label, code, onClose }: Props) {
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
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0A2542,#0A58FF,#1b9fff)] p-12">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-emerald-300/20 blur-2xl" />
          <div className="relative h-44 w-4/5 rounded-xl border-4 border-white/90 shadow-2xl">
            <div className="absolute inset-x-4 bottom-5 h-1 bg-white/60" />
            <div className="absolute inset-y-4 left-5 w-1 bg-white/50" />
            <div className="absolute inset-y-4 right-5 w-1 bg-white/50" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold tracking-[0.2em] text-white/90">
              {code}
            </span>
          </div>
          <span className="absolute bottom-5 left-6 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            <FiZoomIn className="mr-1 inline" /> Preview
          </span>
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-light)]">
            Resource visual
          </p>
          <h3 className="mt-1 text-xl font-semibold text-[var(--color-accent)]">{label}</h3>
        </div>
      </div>
    </div>
  );
}
