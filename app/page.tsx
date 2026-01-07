'use client';

import { useState, useMemo } from 'react';
import { pokemonSets } from '@/data/sets';
import { SortOption } from '@/types/pokemon';
import HeroBanner from '@/components/home/HeroBanner';
import FilterSidebar from '@/components/home/FilterSidebar';
import SetsGrid from '@/components/home/SetsGrid';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Get unique series and years for filters
  const availableSeries = useMemo(() => {
    const seriesMap = new Map();
    pokemonSets.forEach((set) => {
      if (!seriesMap.has(set.seriesCode)) {
        seriesMap.set(set.seriesCode, set.series);
      }
    });
    return Array.from(seriesMap.entries()).map(([code, name]) => ({ code, name }));
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    pokemonSets.forEach((set) => {
      const yearMatch = set.date.match(/\d{4}/);
      if (yearMatch) {
        years.add(yearMatch[0]);
      }
    });
    return Array.from(years).sort().reverse();
  }, []);

  // Filter and sort sets
  const filteredSets = useMemo(() => {
    let filtered = [...pokemonSets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (set) =>
          set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          set.series.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Series filter
    if (selectedSeries.length > 0) {
      filtered = filtered.filter((set) => selectedSeries.includes(set.seriesCode));
    }

    // Year filter
    if (selectedYears.length > 0) {
      filtered = filtered.filter((set) => {
        const yearMatch = set.date.match(/\d{4}/);
        return yearMatch && selectedYears.includes(yearMatch[0]);
      });
    }

    // Sort
    if (sortOption === 'oldest') {
      filtered = [...filtered].reverse();
    } else if (sortOption === 'alphabetical') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'newest' is default order from data

    return filtered;
  }, [searchQuery, selectedSeries, selectedYears, sortOption]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />

      <div className="flex max-w-[1600px] mx-auto relative">
        <FilterSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSeries={selectedSeries}
          onSeriesChange={setSelectedSeries}
          selectedYears={selectedYears}
          onYearsChange={setSelectedYears}
          sortOption={sortOption}
          onSortChange={setSortOption}
          availableSeries={availableSeries}
          availableYears={availableYears}
        />

        <main className="flex-1 p-8 max-w-full">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div></div>
            <div className="flex gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`px-4 py-2.5 border rounded-lg font-medium transition-all ${
                  sidebarOpen
                    ? 'bg-poke-blue-light border-poke-blue text-poke-blue-text'
                    : 'bg-white/5 border-gray-300 text-gray-600 hover:bg-poke-blue-light hover:border-poke-blue hover:text-poke-blue-text'
                }`}
                title="Toggle filters"
              >
                ☰ Filters
              </button>
            </div>
          </div>

          <SetsGrid sets={filteredSets} />
        </main>
      </div>
    </div>
  );
}
