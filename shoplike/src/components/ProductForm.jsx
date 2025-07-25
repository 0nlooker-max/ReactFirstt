import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../services/productService';

export function ProductForm({ existing, onSaved }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    rating: '',
    reviewCount: '',
    category: '',
    badge: '',
    seller: '',
    location: ''
  });

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (existing) {
      await updateProduct(existing.id, form);
    } else {
      await createProduct(form);
    }
    onSaved();
    setForm({
      id: '',
      name: '',
      price: '',
      originalPrice: '',
      image: '',
      rating: '',
      reviewCount: '',
      category: '',
      badge: '',
      seller: '',
      location: ''
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-md rounded-lg space-y-4 max-w-3xl mx-auto"
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          name="id"
          placeholder="Product ID"
          value={form.id}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          name="originalPrice"
          type="number"
          placeholder="Original Price"
          value={form.originalPrice}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="rating"
          type="number"
          step="0.1"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="reviewCount"
          type="number"
          placeholder="Review Count"
          value={form.reviewCount}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="badge"
          placeholder="Badge (e.g. Best Seller)"
          value={form.badge}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="seller"
          placeholder="Seller"
          value={form.seller}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {existing ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
