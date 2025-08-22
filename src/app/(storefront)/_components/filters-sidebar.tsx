'use client';

import { useMemo, useState } from "react";

type Category = { id: string; name: string; slug: string };

export default function FiltersSidebar({
  categories,
  onChange,
}: {
  categories: Category[];
  onChange: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    setSelected(next);
    onChange(next);
  }

  const all = useMemo(() => categories ?? [], [categories]);

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider">Categorías</h3>
        <div className="mt-3 space-y-2">
          {all.map(c => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}