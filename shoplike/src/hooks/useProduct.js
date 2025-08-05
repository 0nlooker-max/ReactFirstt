import { useState, useMemo, useEffect, useCallback } from "react";
import {getAllProducts} from "../services/productService";

export const useProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prods = await getAllProducts();
      setRawProducts(Array.isArray(prods) ? prods : []);
    } catch (e) {
      console.error("Failed to fetch products:", e);
      setError(e);
      setRawProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = rawProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        const name = (product.name || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        const seller = (product.seller || "").toLowerCase();
        return (
          name.includes(query) ||
          category.includes(query) ||
          seller.includes(query)
        );
      });
    }

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        // if you have createdAt or numeric id
        if (sorted[0] && sorted[0].createdAt != null) {
          sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        } else if (sorted[0] && typeof sorted[0].id === "number") {
          sorted.sort((a, b) => b.id - a.id);
        }
        break;
      default:
        // relevance: keep original order from Firestore
        break;
    }

    return sorted;
  }, [rawProducts, searchQuery, selectedCategory, sortBy]);

  return {
    products: filteredAndSortedProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    loading,
    error,
    reload: load,
  };
};
