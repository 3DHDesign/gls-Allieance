import type { RegistrationForm } from "../../types/registration";
import { useMemo, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";

export default function Step4CompanyProfile({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: RegistrationForm;
  setForm: (f: RegistrationForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const value = form.company.profileBrief || "";
  const [error, setError] = useState<string | null>(null);

  const isImporterExporter = form.profileType === "importer_exporter";

  const countWords = (text: string) =>
    text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const words = useMemo(() => countWords(value), [value]);

  const onChange = (text: string) => {
    const w = countWords(text);
    if (w <= 500) {
      setError(null);
      setForm({ ...form, company: { ...form.company, profileBrief: text } });
    } else {
      const trimmed = text.trim().split(/\s+/).slice(0, 500).join(" ");
      setForm({ ...form, company: { ...form.company, profileBrief: trimmed } });
      setError("Limited to 500 words. Extra text was trimmed.");
    }
  };

  // ✅ Cover photo upload (Importer/Exporter only)
  const onPickCover = (file: File | null) => {
    if (!file) return;

    // basic validation
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG/PNG/WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large. Max 5MB.");
      return;
    }

    setError(null);

    const preview = URL.createObjectURL(file);

    setForm({
      ...form,
      company: {
        ...form.company,
        coverPhoto: file,
        coverPhotoPreview: preview,
      },
    });
  };

  const removeCover = () => {
    const prev = form.company.coverPhotoPreview;
    if (prev) URL.revokeObjectURL(prev);

    setForm({
      ...form,
      company: {
        ...form.company,
        coverPhoto: null,
        coverPhotoPreview: "",
      },
    });
  };

  // ✅ you can decide if cover photo is required or optional
  const coverOk = !isImporterExporter || !!form.company.coverPhoto;
  const canNext = words > 0 && words <= 500 && coverOk;

  return (
    <section className="container mt-6">
      <div className="rounded-2xl bg-white border border-gray-400 shadow p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-accent)] mb-4">
          Company Profile
        </h2>

        <p className="text-sm text-[var(--color-muted)] mb-3">
          Add a short public overview of your company (max 500 words).
        </p>

        {/* ✅ Cover Photo (Importer/Exporter only) */}
        {isImporterExporter && (
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--color-black)]">
                  Cover Photo
                </div>
                <div className="text-xs text-[var(--color-muted)]/80 mt-1">
                  Shown on your directory profile. Recommended: 1600×900.
                </div>
              </div>

              {form.company.coverPhoto && (
                <button
                  type="button"
                  onClick={removeCover}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <FiX /> Remove
                </button>
              )}
            </div>

            {form.company.coverPhotoPreview ? (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src={form.company.coverPhotoPreview}
                  alt="Cover preview"
                  className="h-[220px] w-full object-cover"
                />
              </div>
            ) : (
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-[var(--color-muted)] hover:bg-gray-100">
                <FiUpload className="text-lg" />
                <span>Upload cover photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickCover(e.target.files?.[0] ?? null)}
                />
              </label>
            )}

            {!form.company.coverPhoto && (
              <div className="mt-2 text-xs text-red-600">
                Cover photo is required for Importer / Exporter profiles.
              </div>
            )}
          </div>
        )}

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-gray-200 px-3 py-3"
        />

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={error ? "text-red-600" : "text-[var(--color-muted)]"}>
            {error
              ? error
              : "Keep it concise and factual. This will be visible in the directory profile."}
          </span>
          <span className={words > 500 ? "text-red-600" : "text-[var(--color-muted)]"}>
            {words}/500 words
          </span>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-4 py-2"
          >
            Back
          </button>

          <button
            onClick={onNext}
            disabled={!canNext}
            className="btn-accent disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
