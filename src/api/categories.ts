// src/api/categories.ts
import http from "./http";

export type CategoryRow = {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;
  parent_id?: number | string | null;
  has_children?: boolean;
  is_parent?: boolean;
};

export type CategoryNode = {
  id: string;
  name: string;
  parentId: string | null;
  children: CategoryNode[];
};

function pickArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.categories)) return payload.categories;
  return [];
}

function safeName(x: any) {
  return String(x?.name ?? x?.title ?? "Unnamed").trim();
}

export async function getCategories() {
  // IMPORTANT: your http.ts baseURL should be ".../api"
  // so this becomes: http://admin.glsalliance.com/api/categories
  const res = await http.get("/categories");
  return res.data;
}

export function normalizeCategories(payload: any): CategoryNode[] {
  const rows = pickArray(payload) as CategoryRow[];

  const flat = rows.map((r) => ({
    id: String(r.id),
    name: safeName(r),
    parentId:
      r.parent_id === null || r.parent_id === undefined
        ? null
        : String(r.parent_id),
  }));

  // group by parentId
  const byParent = new Map<string | null, CategoryNode[]>();
  for (const item of flat) {
    const node: CategoryNode = { ...item, children: [] };
    const key = item.parentId;
    const list = byParent.get(key) ?? [];
    list.push(node);
    byParent.set(key, list);
  }

  // attach children to parents
  const allById = new Map<string, CategoryNode>();
  for (const list of byParent.values()) {
    for (const n of list) allById.set(n.id, n);
  }

  for (const n of allById.values()) {
    const kids = byParent.get(n.id) ?? [];
    n.children = kids.sort((a, b) => a.name.localeCompare(b.name));
  }

  const roots = (byParent.get(null) ?? [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => allById.get(r.id)!)
    .filter(Boolean);

  return roots;
}