import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../services/productService";

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

  const fields = [
    ["name", "Product Name"],
    ["imageUrl", "Image URL"],
    ["badge", "Badge (e.g., Best Seller)"],
    ["discount", "Discount (%)"],
    ["price", "Price"],
    ["originalPrice", "Original Price"],
    ["rating", "Rating"],
    ["reviewCount", "Review Count"],
    ["category", "Category"],
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
                ["price", "originalPrice", "discount", "rating", "reviewCount"].includes(field)
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
