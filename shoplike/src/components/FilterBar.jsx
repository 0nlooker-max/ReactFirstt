import React from "react";
import { Filter, SortAsc } from "lucide-react";
import "../assets/componentcss/FilterBar.css";

export const FilterBar = ({ sortBy, onSortChange, totalProducts }) => {
  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ];

  return (
    <div className="filter-bar">
      <div className="left">
        <span className="count">
          {totalProducts.toLocaleString()} products found
        </span>
      </div>

      <div className="right">
        <div className="sort-group">
          <SortAsc size={16} className="icon" />
          <span className="label">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button className="filter-button">
          <Filter size={16} className="icon" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};
