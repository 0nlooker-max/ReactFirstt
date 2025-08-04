import React, { useEffect, useState } from "react";
import { createProduct, updateProduct } from "../services/productService";
import { getAllCategories, createCategory } from "../services/categoryService";
import { getAllBadges, createBadge } from "../services/badgeService";
import "../assets/addprdct/ProductForm.css";

export function ProductForm({ existing = null, onSaved = () => {} }) {
  const [name, setName] = useState(existing?.name || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [price, setPrice] = useState(existing?.price || "");
  const [originalPrice, setOriginalPrice] = useState(
    existing?.originalPrice || ""
  );
  const [details, setDetails] = useState(existing?.details || "");
  const [category, setCategory] = useState(existing?.category || "");
  const [badge, setBadge] = useState(existing?.badge || "");
  const [seller, setSeller] = useState(existing?.seller || "");
  const [location, setLocation] = useState(existing?.location || "");
  const [imageUrl, setImageUrl] = useState(
    existing?.imageUrl || existing?.image || ""
  );
  const [rating, setRating] = useState(existing?.rating || 0);
  const [reviewCount, setReviewCount] = useState(existing?.reviewCount || 0);

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [badges, setBadges] = useState([]);
  const [newBadgeName, setNewBadgeName] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const cats = await getAllCategories();
      setCategories(cats);
      if (!category && cats.length) setCategory(cats[0].name);
    } catch (e) {
      console.error("Failed to load categories", e);
    }
  };

  const loadBadges = async () => {
    try {
      const b = await getAllBadges();
      setBadges(b);
      if (!badge && b.length) setBadge(b[0].name);
    } catch (e) {
      console.error("Failed to load badges", e);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBadges();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const created = await createCategory(newCategoryName);
      setCategories((c) =>
        [...c, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      setCategory(created.name);
      setNewCategoryName("");
    } catch (err) {
      console.error(err);
      setError("Failed to add category");
    }
  };

  const handleAddBadge = async (e) => {
    e.preventDefault();
    if (!newBadgeName.trim()) return;
    try {
      const created = await createBadge(newBadgeName);
      setBadges((b) =>
        [...b, created].sort((a, b2) => a.name.localeCompare(b2.name))
      );
      setBadge(created.name);
      setNewBadgeName("");
    } catch (err) {
      console.error(err);
      setError("Failed to add badge");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name,
      description,
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      details,
      category,
      badge,
      seller,
      location,
      imageUrl,
      rating: parseFloat(rating) || 0,
      reviewCount: parseInt(reviewCount, 10) || 0,
      updatedAt: Date.now(),
    };

    try {
      if (existing && existing.id) {
        await updateProduct(existing.id, payload);
      } else {
        await createProduct(payload);
      }
      onSaved();
    } catch (err) {
      console.error("Save failed", err);
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="field">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      {/* Category with add */}
      <div className="field">
        <label>Category</label>
        <div className="category-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
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
          <div className="add-category">
            <input
              placeholder="New category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Badge with add */}
      <div className="field">
        <label>Badge</label>
        <div className="category-row">
          <select value={badge} onChange={(e) => setBadge(e.target.value)}>
            <option value="" disabled>
              Select badge
            </option>
            {badges.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          <div className="add-category">
            <input
              placeholder="New badge"
              value={newBadgeName}
              onChange={(e) => setNewBadgeName(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddBadge}
              disabled={!newBadgeName.trim()}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      <div className="field-pair price-group">
        <div className="field">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Original Price</label>
          <input
            type="number"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="field">
        <label>Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        ></textarea>
      </div>

      <div className="field-pair">
        <div className="field">
          <label>Seller</label>
          <input value={seller} onChange={(e) => setSeller(e.target.value)} />
        </div>
        <div className="field">
          <label>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>Image URL</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div className="field-inline">
        <div className="field">
          <label>Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Review Count</label>
          <input
            type="number"
            min="0"
            value={reviewCount}
            onChange={(e) => setReviewCount(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : existing
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
}
