import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { ProductForm } from "./ProductForm";
import "../assets/addprdct/list.css";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const items = await getAllProducts();
      setProducts(items || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="container">
      <h2 className="section-title">{editing ? "Edit Product" : "New Product"}</h2>

      <div className="card form-card">
        <ProductForm
          existing={editing}
          onSaved={() => {
            load();
            setEditing(null);
          }}
        />
      </div>

      <h2 className="subsection-title">All Products</h2>

      {loading ? (
        <div className="status-message">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="status-message">No products found.</div>
      ) : (
        <div className="product-list-wrapper">
          <ul className="product-list">
            {products.map((p) => {
              const imageSrc = p.image || p.imageUrl || "";
              const discount = calculateDiscount(p.price, p.originalPrice);

              return (
                <li key={p.id} className="product-item">
                  <div className="image-wrapper">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={p.name}
                        className="product-image"
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </div>

                  <div className="product-content">
                    <h3 className="product-name">{p.name || "Untitled"}</h3>

                    <div className="price-row">
                      <p className="price">
                        ${typeof p.price === "number" ? p.price.toFixed(2) : p.price}
                      </p>
                      {p.originalPrice && (
                        <span className="original-price">
                          ${p.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="badges">
                      {p.badge && (
                        <span className="badge badge-primary">{p.badge}</span>
                      )}
                      {discount > 0 && (
                        <span className="badge badge-secondary">-{discount}%</span>
                      )}
                    </div>

                    {p.rating != null && (
                      <p className="rating">
                        ⭐ {p.rating.toFixed(1)} (
                        {p.reviewCount?.toLocaleString() || 0} reviews)
                      </p>
                    )}

                    {p.description && (
                      <p className="description">{p.description}</p>
                    )}
                    {p.details && <p className="details">{p.details}</p>}

                    <p className="meta">
                      Category: <span className="meta-value">{p.category}</span>
                    </p>
                    <p className="meta">
                      Seller: <span className="meta-value">{p.seller}</span> —{" "}
                      {p.location}
                    </p>

                    <div className="actions">
                      <button
                        onClick={() => setEditing(p)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          await deleteProduct(p.id);
                          load();
                        }}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
