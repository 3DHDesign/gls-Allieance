// src/components/FreightDirectory/ExportCategorySidebar.tsx
import { useEffect,   useState } from "react";
import { FiPlus, FiMinus, FiRefreshCcw } from "react-icons/fi";
import { getCategories, normalizeCategories, type CategoryNode } from "../../api/categories";

type Props = {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
};

export default function ExportCategorySidebar({ selectedCategoryId, onSelectCategory }: Props) {
  const [loading, setLoading] = useState(false);
  const [roots, setRoots] = useState<CategoryNode[]>([]);
  const [openParentId, setOpenParentId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getCategories();
        const tree = normalizeCategories(data);
        setRoots(tree);
      } catch (e) {
        setErr("Failed to load categories.");
        setRoots([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // auto-open parent if a sub category is selected
  useEffect(() => {
    if (!selectedCategoryId) return;

    const findParent = (nodes: CategoryNode[], target: string): string | null => {
      for (const p of nodes) {
        if (p.id === target) return p.id; // selected is parent itself
        for (const c of p.children) {
          if (c.id === target) return p.id;
        }
      }
      return null;
    };

    const pid = findParent(roots, selectedCategoryId);
    if (pid) setOpenParentId(pid);
  }, [selectedCategoryId, roots]);

  const hasData = roots.length > 0;

  return (
    <aside className="rounded-2xl bg-white border border-gray-100 shadow-xl p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[var(--color-accent)]">
          Categories
        </h3>

        <button
          onClick={() => onSelectCategory(null)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
          title="Clear category"
        >
          <FiRefreshCcw />
          Clear
        </button>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left rounded-xl border px-4 py-3 transition ${
            selectedCategoryId === null
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          All Categories
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && (
          <div className="rounded-xl border border-gray-100 p-4 text-sm text-muted">
            Loading categories...
          </div>
        )}

        {err && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {!loading && !err && !hasData && (
          <div className="rounded-xl border border-gray-100 p-4 text-sm text-muted">
            No categories found.
          </div>
        )}

        {!loading &&
          !err &&
          roots.map((parent) => {
            const isOpen = openParentId === parent.id;
            const parentSelected = selectedCategoryId === parent.id;

            return (
              <div key={parent.id} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-stretch">
                  {/* Parent select (Option A) */}
                  <button
                    type="button"
                    onClick={() => onSelectCategory(parent.id)}
                    className={`flex-1 text-left px-4 py-3 transition ${
                      parentSelected
                        ? "bg-[var(--color-accent)]/10 text-gray-900"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{parent.name}</div>
                  </button>

                  {/* Expand/Collapse */}
                  <button
                    type="button"
                    onClick={() => setOpenParentId(isOpen ? null : parent.id)}
                    className="w-12 grid place-items-center border-l border-gray-200 hover:bg-gray-50"
                    aria-label={isOpen ? "Collapse" : "Expand"}
                  >
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </button>
                </div>

                {/* Children */}
                {isOpen && parent.children.length > 0 && (
                  <div className="border-t border-gray-200 bg-gray-50/40">
                    {parent.children.map((child) => {
                      const childSelected = selectedCategoryId === child.id;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => onSelectCategory(child.id)}
                          className={`w-full text-left px-5 py-2.5 text-sm border-b last:border-b-0 border-gray-200 transition ${
                            childSelected
                              ? "bg-[var(--color-accent)]/10 font-medium"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {child.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </aside>
  );
}