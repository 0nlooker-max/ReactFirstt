import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../services/productService";
import { getAllCategories, createCategory } from "../services/categoryService";
import { getAllBadges, createBadge } from "../services/badgeService";

export function ProductForm({ existing, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    badge: "",
    discount: "",
    price: "",
    originalPrice: "",
    rating: "",
    reviewCount: "",
    category: "",
    seller: "",
    location: "",
    description: "",
    details: "",
  });
  const [categories, setCategories] = useState([]);
  const [badges, setBadges] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newBadgeName, setNewBadgeName] = useState("");

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || "",
        imageUrl: existing.imageUrl || "",
        badge: existing.badge || "",
        discount: existing.discount || "",
        price: existing.price || "",
        originalPrice: existing.originalPrice || "",
        rating: existing.rating || "",
        reviewCount: existing.reviewCount || "",
        category: existing.category || "",
        seller: existing.seller || "",
        location: existing.location || "",
        description: existing.description || "",
        details: existing.details || "",
      });
    } else {
      setForm({
        name: "",
        imageUrl: "",
        badge: "",
        discount: "",
        price: "",
        originalPrice: "",
        rating: "",
        reviewCount: "",
        category: "",
        seller: "",
        location: "",
        description: "",
        details: "",
      });
    }
  }, [existing]);

  // Fetch categories and badges
  useEffect(() => {
    getAllCategories().then(setCategories);
    getAllBadges().then(setBadges);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existing) {
      await updateProduct(existing.id, form);
    } else {
      await createProduct(form);
    }
    onSaved();
    setForm({
      name: "",
      imageUrl: "",
      badge: "",
      discount: "",
      price: "",
      originalPrice: "",
      rating: "",
      reviewCount: "",
      category: "",
      seller: "",
      location: "",
      description: "",
      details: "",
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const newCat = await createCategory(newCategoryName);
    setCategories((prev) => [...prev, newCat]);
    setForm((prev) => ({ ...prev, category: newCat.name }));
    setNewCategoryName("");
  };

  const handleAddBadge = async () => {
    if (!newBadgeName.trim()) return;
    const newBadge = await createBadge(newBadgeName);
    setBadges((prev) => [...prev, newBadge]);
    setForm((prev) => ({ ...prev, badge: newBadge.name }));
    setNewBadgeName("");
  };

  const fields = [
    ["name", "Product Name"],
    ["imageUrl", "Image URL"],
    ["discount", "Discount (%)"],
    ["price", "Price"],
    ["originalPrice", "Original Price"],
    ["rating", "Rating"],
    ["reviewCount", "Review Count"],
    ["seller", "Seller"],
    ["location", "Location"],
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([field, label]) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={
                [
                  "price",
                  "originalPrice",
                  "discount",
                  "rating",
                  "reviewCount",
                ].includes(field)
                  ? "number"
                  : "text"
              }
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={field !== "badge"}
            />
          </div>
        ))}
      </div>
      <div className="field mt-4">
        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <div className="flex gap-2 items-center">
          <select
            id="category-select"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="field mt-4">
        <label htmlFor="badge-select" className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
        <div className="flex gap-2 items-center">
          <select
            id="badge-select"
            name="badge"
            value={form.badge}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="" disabled>
              Select badge
            </option>
            {badges.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New badge"
            value={newBadgeName}
            onChange={(e) => setNewBadgeName(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddBadge}
            disabled={!newBadgeName.trim()}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Details
        </label>
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      <div className="mt-6 text-right">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {existing ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
