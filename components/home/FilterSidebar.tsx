'use client';

import { SortOption } from '@/types/pokemon';
import { useTranslation } from '@/contexts/I18nContext';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSeries: string[];
  onSeriesChange: (series: string[]) => void;
  selectedYears: string[];
  onYearsChange: (years: string[]) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  availableSeries: { code: string; name: string }[];
  availableYears: string[];
}

export default function FilterSidebar({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  selectedSeries,
  onSeriesChange,
  selectedYears,
  onYearsChange,
  sortOption,
  onSortChange,
  availableSeries,
  availableYears,
}: FilterSidebarProps) {
  const { t } = useTranslation();

  const toggleSeries = (code: string) => {
    if (selectedSeries.includes(code)) {
      onSeriesChange(selectedSeries.filter((s) => s !== code));
    } else {
      onSeriesChange([...selectedSeries, code]);
    }
  };

  const toggleYear = (year: string) => {
    if (selectedYears.includes(year)) {
      onYearsChange(selectedYears.filter((y) => y !== year));
    } else {
      onYearsChange([...selectedYears, year]);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          sticky top-[70px] left-0 h-[calc(100vh-70px)]
          glass-sidebar overflow-y-auto z-50 flex-shrink-0
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-[280px] p-6' : 'w-0 p-0 overflow-hidden -translate-x-full'}
        `}
      >
        <div className="sidebar-header flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-charcoal text-lg font-semibold">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            title="Close sidebar"
          >
            ✕
          </button>
        </div>
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={t('sets.search_placeholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-poke-blue"
          />
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-charcoal mb-3">Sort By</h3>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-poke-blue"
          >
            <option value="newest">{t('sets.sort.newest')}</option>
            <option value="oldest">{t('sets.sort.oldest')}</option>
            <option value="alphabetical">{t('sets.sort.alphabetical')}</option>
          </select>
        </div>

        {/* Series Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-charcoal mb-3">Series</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {availableSeries.map((series) => (
              <label key={series.code} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSeries.includes(series.code)}
                  onChange={() => toggleSeries(series.code)}
                  className="w-4 h-4 text-poke-blue border-gray-300 rounded focus:ring-poke-blue"
                />
                <span className="text-sm text-gray-700">{series.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-charcoal mb-3">Year</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {availableYears.map((year) => (
              <label key={year} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedYears.includes(year)}
                  onChange={() => toggleYear(year)}
                  className="w-4 h-4 text-poke-blue border-gray-300 rounded focus:ring-poke-blue"
                />
                <span className="text-sm text-gray-700">{year}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
