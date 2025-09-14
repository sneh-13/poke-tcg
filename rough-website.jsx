import React, { useEffect, useMemo, useState } from "react";

// Minimal, single-file front page for a Pokémon TCG sets browser
// TailwindCSS classes are used for styling. No external UI libs required.
// Data is fetched from the Pokémon TCG API (https://docs.pokemontcg.io/).
// ─────────────────────────────────────────────────────────────────────────────
// Quick hookup:
// 1) Ensure Tailwind is configured in your app (or replace classes with your CSS).
// 2) Provide an API key in env (optional but recommended):
//    - Vite: import.meta.env.VITE_POKEMONTCG_API_KEY
//    - Next.js: process.env.NEXT_PUBLIC_POKEMONTCG_API_KEY (or server-side)
// 3) Drop this component into your route (e.g., App.tsx or page.tsx) and render.
// 4) Replace the placeholder logo text with your own branding.
// ─────────────────────────────────────────────────────────────────────────────

type TcgSet = {
  id: string;
  name: string;
  series: string;
  releaseDate: string; // YYYY/MM/DD
  total?: number;
  printedTotal?: number;
  images?: { symbol?: string; logo?: string };
};

const API_URL = "https://api.pokemontcg.io/v2/sets?orderBy=releaseDate";

// Preferred display order for TCG series (new → old)
const SERIES_ORDER = [
  "Scarlet & Violet",
  "Sword & Shield",
  "Sun & Moon",
  "XY",
  "Black & White",
  "HeartGold & SoulSilver",
  "Platinum",
  "Diamond & Pearl",
  "EX",
  "e-Card",
  "Neo",
  "Gym",
  "Base",
];

function useSets() {
  const [sets, setSets] = useState<TcgSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {};
        const key =
          (typeof import.meta !== "undefined" && import.meta.env?.VITE_POKEMONTCG_API_KEY) ||
          (typeof process !== "undefined" && (process as any)?.env?.NEXT_PUBLIC_POKEMONTCG_API_KEY);
        if (key) headers["X-Api-Key"] = key as string;

        const res = await fetch(API_URL, { headers });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const json = await res.json();
        const data: TcgSet[] = json?.data || [];
        if (isMounted) setSets(data);
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load sets");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { sets, loading, error };
}

function formatDate(yyyyMmDd?: string) {
  if (!yyyyMmDd) return "";
  // API dates are like "1999/01/09"; make it human-friendly
  const [y, m, d] = yyyyMmDd.split("/").map(Number);
  if (!y || !m || !d) return yyyyMmDd;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
}

export default function HomePage() {
  const { sets, loading, error } = useSets();

  // ── UI state
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("All");
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");
  const [groupBySeries, setGroupBySeries] = useState(true);

  // ── derived filters
  const allSeries = useMemo(() => {
    const s = Array.from(new Set(sets.map((x) => x.series))).sort();
    return ["All", ...s];
  }, [sets]);

  const allYears = useMemo(() => {
    const years = Array.from(
      new Set(
        sets
          .map((x) => x.releaseDate?.slice(0, 4))
          .filter(Boolean)
      )
    ).sort();
    return ["All", ...years];
  }, [sets]);

  const filtered = useMemo(() => {
    let out = sets.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((s) =>
        [s.name, s.series].some((v) => v?.toLowerCase().includes(q))
      );
    }
    if (series !== "All") out = out.filter((s) => s.series === series);
    if (year !== "All") out = out.filter((s) => s.releaseDate?.startsWith(year));

    switch (sort) {
      case "newest":
        out.sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
        break;
      case "oldest":
        out.sort((a, b) => (a.releaseDate || "").localeCompare(b.releaseDate || ""));
        break;
      case "name":
        out.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return out;
  }, [sets, query, series, year, sort]);

  // Group filtered sets by series for grouped rendering
  const grouped = useMemo(() => {
    const map = new Map<string, TcgSet[]>();
    for (const s of filtered) {
      const key = s.series || "Unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    // sort the items within each series according to current sort
    for (const list of map.values()) {
      switch (sort) {
        case "newest":
          list.sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
          break;
        case "oldest":
          list.sort((a, b) => (a.releaseDate || "").localeCompare(b.releaseDate || ""));
          break;
        case "name":
          list.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }
    const known = SERIES_ORDER.filter((k) => map.has(k)).map((k) => [k, map.get(k)!] as const);
    const others = Array.from(map.keys())
      .filter((k) => !SERIES_ORDER.includes(k))
      .sort()
      .map((k) => [k, map.get(k)!] as const);
    return [...known, ...others];
  }, [filtered, sort]);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg border flex items-center justify-center text-xs font-bold">PK</div>
            <span className="font-semibold tracking-tight">PokéTCG Library</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a href="#" className="text-sm text-neutral-600 hover:text-neutral-900">About</a>
            <a href="#" className="text-sm text-neutral-600 hover:text-neutral-900">GitHub</a>
          </div>
        </div>
      </header>

      {/* Hero / Controls */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">All Pokémon TCG Sets</h1>
            <p className="text-sm text-neutral-600">Browse every set, filter by series or year, and click a set to view its cards.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by set name or series…"
              className="w-full md:flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <div className="grid grid-cols-2 md:flex gap-2 md:gap-3">
              <select
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="rounded-xl border px-3 py-2 text-sm"
                aria-label="Filter by series"
              >
                {allSeries.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-xl border px-3 py-2 text-sm"
                aria-label="Filter by year"
              >
                {allYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="rounded-xl border px-3 py-2 text-sm"
                aria-label="Sort"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name A–Z</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm px-1">
                <input
                  type="checkbox"
                  checked={groupBySeries}
                  onChange={(e) => setGroupBySeries(e.target.checked)}
                  className="h-4 w-4"
                />
                Group by series
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        {loading ? (
          <div className="text-sm text-neutral-600">Loading sets…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error} — showing nothing for now.</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-neutral-600">No sets match your filters.</div>
        ) : groupBySeries ? (
          <div className="space-y-8">
            {grouped.map(([seriesName, items]) => (
              <section key={seriesName}>
                <h2 className="text-sm font-semibold text-neutral-700 mb-3">{seriesName}</h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#/set/${s.id}`}
                        className="block rounded-2xl border hover:shadow-md transition-shadow"
                      >
                        <div className="p-4 flex flex-col gap-3">
                          {s.images?.symbol ? (
                            <img
                              src={s.images.symbol}
                              alt=""
                              className="h-10 w-10 object-contain opacity-80"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-neutral-100" />
                          )}
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium leading-tight line-clamp-2">{s.name}</h3>
                            <p className="text-xs text-neutral-500">{s.series}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between text-xs text-neutral-500">
                            <span>{formatDate(s.releaseDate)}</span>
                            <span>{s.printedTotal ?? s.total ?? ""} cards</span>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((s) => (
              <li key={s.id}>
                <a
                  href={`#/set/${s.id}`}
                  className="block rounded-2xl border hover:shadow-md transition-shadow"
                >
                  <div className="p-4 flex flex-col gap-3">
                    {s.images?.symbol ? (
                      <img
                        src={s.images.symbol}
                        alt=""
                        className="h-10 w-10 object-contain opacity-80"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-neutral-100" />
                    )}

                    <div className="space-y-1">
                      <h3 className="text-sm font-medium leading-tight line-clamp-2">{s.name}</h3>
                      <p className="text-xs text-neutral-500">{s.series}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between text-xs text-neutral-500">
                      <span>{formatDate(s.releaseDate)}</span>
                      <span>{s.printedTotal ?? s.total ?? ""} cards</span>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-500">
          Built by Sneh & friend · Data courtesy of Pokémon TCG API. Pokémon is © The Pokémon Company.
        </div>
      </footer>
    </div>
  );
}
