import React from "react";
import { X } from "lucide-react";
import { categories } from "../data/products";
import { Link } from "react-router-dom";

export const Sidebar = ({
  selectedCategory,
  onCategoryChange,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen lg:h-auto
        w-72 lg:w-64 bg-white shadow-lg lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:mt-0 overflow-y-auto
      `}
      >
        <div className="p-4 lg:p-6">
          {/* Mobile close button */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex justify-between items-center mb-6 bg-white rounded shadow-md p-2">
            <span className="text-gray-600 text-sm hover:text-gray-900 transition duration-300 ease-in-out text-size-14">
              <Link to="/addproduct" className="underline hover:no-underline">
                <span className="font-medium">Add Product</span>
              </Link>
            </span>
          </div>

          {/* Desktop title */}
          <h2 className="hidden lg:block text-lg font-semibold text-gray-800 mb-6">
            Categories
          </h2>

          {/* Category list */}
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                  transition-all duration-200 group
                  ${
                    selectedCategory === category.id
                      ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <span className="text-xl">{category.icon}</span>
                <span
                  className={`
                  font-medium transition-all duration-200
                  ${selectedCategory === category.id ? "font-semibold" : ""}
                  group-hover:translate-x-1
                `}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          {/* Promotional section */}
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Special Offers</h3>
            <p className="text-sm text-blue-700 mb-3">
              Get up to 50% off on selected items
            </p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
              View Deals
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
