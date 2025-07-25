// src/components/ProductList.tsx
import { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../services/productService';
import { ProductForm } from './ProductForm';
import { Product } from '../types';


export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = async () => {
    const items = await getAllProducts();
    setProducts(items);
    setEditing(null);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>{editing ? 'Edit Product' : 'New Product'}</h2>
      <ProductForm existing={editing} onSaved={load} />

      <h2>All Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <strong>{p.name}</strong> — ${p.price}
            <button onClick={() => setEditing(p)}>Edit</button>
            <button
              onClick={async () => {
                await deleteProduct(p.id);
                load();
              }}
            >
              Delete
            </button>
            <p>{p.description}</p>
            <small>{p.details}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
