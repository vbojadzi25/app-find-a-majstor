import React from 'react';
import { SearchFilters as SearchFiltersType, ServiceCategory } from '../../types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleChange = (key: keyof SearchFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <div className="search-filters-bar">
      <div className="filter-container">
        <div className="search-input-group">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search craftsmen by name or skills..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="main-search-input"
          />
        </div>

        <div className="filter-pills">
          <div className="filter-pill">
            <select
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Services</option>
              {Object.values(ServiceCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-pill">
            <input
              type="text"
              placeholder="Location"
              value={filters.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="location-input"
            />
          </div>

          <div className="filter-pill">
            <select
              value={filters.minRating || ''}
              onChange={(e) => handleChange('minRating', parseFloat(e.target.value) || undefined)}
              className="rating-select"
            >
              <option value="">Any Rating</option>
              <option value="4.5">⭐ 4.5+</option>
              <option value="4.0">⭐ 4.0+</option>
              <option value="3.5">⭐ 3.5+</option>
              <option value="3.0">⭐ 3.0+</option>
            </select>
          </div>

          {(filters.searchTerm || filters.category || filters.location || filters.minRating) && (
            <button
              className="clear-all-btn"
              onClick={() => onFiltersChange({})}
              title="Clear all filters"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;