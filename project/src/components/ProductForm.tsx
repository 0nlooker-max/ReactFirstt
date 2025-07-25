// src/components/ProductForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createProduct, updateProduct } from '../services/productService';

type Product = {
  id?: number;
  name: string;
  description: string;
  price: string; 
  details: string;
};

type ProductFormProps = {
  existing?: Product | null;
  onSaved: () => void;
};

export function ProductForm({ existing, onSaved }: ProductFormProps) {
  const [form, setForm] = useState<Product>({
    name: '',
    description: '',
    price: '',
    details: ''
  });

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (existing && existing.id !== undefined) {
      await updateProduct(existing.id, form);
    } else {
      await createProduct(form);
    }
    onSaved();
    setForm({ name: '', description: '', price: '', details: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <textarea
        name="details"
        placeholder="Details"
        value={form.details}
        onChange={handleChange}
      />
      <button type="submit">
        {existing ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
