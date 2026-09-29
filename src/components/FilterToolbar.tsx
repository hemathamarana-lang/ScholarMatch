import React from 'react';
import { Search, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';

export type SortOption = 'match_desc' | 'award_desc' | 'deadline_asc' | 'hours_asc';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedTier: string;
  onTierChange: (tier: string) => void;
  selectedAwardType: string;
  onAwardTypeChange: (type: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFilteredCount: number;
  comparisonCount: number;
  onOpenComparison: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTier,
  onTierChange,
  selectedAwardType,
  onAwardTypeChange,
  sortBy,
  onSortChange,
  totalFilteredCount,
  comparisonCount,
  onOpenComparison,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      {/* Row 1: Search input and comparison action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by keyword, scholarship name, or organization..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {comparisonCount > 0 && (
            <button
              type="button"
              onClick={onOpenComparison}
              className="px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Compare Selected ({comparisonCount}/3)</span>
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Category, Tier, and Sort dropdowns / segmented controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="stem">STEM & Computing</option>
            <option value="diversity">Diversity & Affinity</option>
            <option value="need_based">Need-Based & Low-Income</option>
            <option value="graduate">Graduate & Fellowships</option>
            <option value="leadership">Leadership & Public Service</option>
            <option value="arts_humanities">Arts & Humanities</option>
            <option value="general_merit">General Merit</option>
          </select>

          {/* Match Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => onTierChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Match Levels</option>
            <option value="direct_match">Direct Matches (85%+)</option>
            <option value="eligible">Eligible & Above (65%+)</option>
            <option value="partial">Partial Matches</option>
          </select>

          {/* Award Type Filter */}
          <select
            value={selectedAwardType}
            onChange={(e) => onAwardTypeChange(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Award Types</option>
            <option value="full_ride">Full Ride / Full Tuition</option>
            <option value="renewable_tuition">Multi-Year Renewable</option>
            <option value="one_time_grant">One-Time Cash Grant</option>
            <option value="fellowship_stipend">Fellowship Stipend</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden"
          >
            <option value="match_desc">Best Match % (High to Low)</option>
            <option value="award_desc">Highest Funding Award</option>
            <option value="deadline_asc">Closest Deadline First</option>
            <option value="hours_asc">Least Prep Hours Required</option>
          </select>
        </div>
      </div>
    </div>
  );
};
