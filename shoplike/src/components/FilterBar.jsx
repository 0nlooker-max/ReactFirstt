import React from 'react';
import { Filter, SortAsc } from 'lucide-react';

export const FilterBar = ({
  sortBy,
  onSortChange,
  totalProducts
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">
          {totalProducts.toLocaleString()} products found
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <SortAsc size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};