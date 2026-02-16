// src/components/Registration/Step4CompanyProfile.tsx
import { useEffect, useMemo, useState } from "react";
import type { RegistrationForm } from "../../types/registration";
import { FiUpload, FiX } from "react-icons/fi";

export default function Step4CompanyProfile({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const isImporterExporter = form.profileType === "importer_exporter";

  const value = form.company.profileBrief || "";
  const [error, setError] = useState<string | null>(null);

  const countWords = (text: string) =>
    text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const words = useMemo(() => countWords(value), [value]);

  const setCompany = (patch: Partial<RegistrationForm["company"]>) => {
    setForm((prev) => ({
      ...prev,
      company: { ...prev.company, ...patch },
    }));
  };

  const onChange = (text: string) => {
    const w = countWords(text);

    if (w <= 500) {
      setError(null);
      setCompany({ profileBrief: text });
      return;
    }

    const trimmed = text.trim().split(/\s+/).slice(0, 500).join(" ");
    setCompany({ profileBrief: trimmed });
    setError("Limited to 500 words. Extra text was trimmed.");
  };

  // ✅ Cover photo upload (Importer/Exporter only)
  const onPickCover = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG/PNG/WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large. Max 5MB.");
      return;
    }

    setError(null);

    // revoke old preview if exists
    const old = form.company.coverPhotoPreview;
    if (old) URL.revokeObjectURL(old);

    const preview = URL.createObjectURL(file);
    setCompany({
      coverPhoto: file,
      coverPhotoPreview: preview,
    });
  };

  const removeCover = () => {
    const prevUrl = form.company.coverPhotoPreview;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    setCompany({
      coverPhoto: null,
      coverPhotoPreview: "",
    });
  };

  // ✅ cleanup preview when component unmounts
  useEffect(() => {
    return () => {
      const prevUrl = form.company.coverPhotoPreview;
      if (prevUrl) URL.revokeObjectURL(prevUrl);
    };
    // run once on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ you can decide if cover photo is required or optional
  const coverOk = !isImporterExporter || !!form.company.coverPhoto;
  const canNext = words > 0 && words <= 500 && coverOk;

  const goNext = () => {
    if (!value.trim()) {
      setError("Please write a short company overview before continuing.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (words > 500) {
      setError("Limited to 500 words.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isImporterExporter && !form.company.coverPhoto) {
      setError("Cover photo is required for Importer / Exporter profiles.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setError(null);
    onNext();
  };

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
                <div className="font-medium text-gray-900">Cover Photo</div>
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
          placeholder="Write a short overview about your company, services, and markets..."
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
            type="button"
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={goNext}
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
