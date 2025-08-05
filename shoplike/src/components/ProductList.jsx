import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { ProductForm } from "./ProductForm";

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
    <div className="container py-4">
      <h2 className="mb-4">{editing ? "Edit Product" : "New Product"}</h2>

      <div className="card mb-5 p-4 shadow-sm">
        <ProductForm
          existing={editing}
          onSaved={() => {
            load();
            setEditing(null);
          }}
        />
      </div>

      <h3 className="mb-4">All Products</h3>

      {loading ? (
        <div className="alert alert-info">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="alert alert-warning">No products found.</div>
      ) : (
        <div className="d-flex flex-wrap justify-content-start gap-4">
          {products.map((p) => {
            const imageSrc = p.image || p.imageUrl || "";
            const discount = calculateDiscount(p.price, p.originalPrice);

            return (
              <div
                key={p.id}
                className="card shadow-sm"
                style={{
                  width: "280px",
                  maxHeight: "520px",
                  marginBottom: "20px",
                }}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={p.name}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                ) : (
                  <div
                    className="bg-light text-center d-flex align-items-center justify-content-center"
                    style={{ height: "180px" }}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}

                <div
                  className="card-body d-flex flex-column p-3"
                  style={{ overflowY: "auto" }}
                >
                  <h5 className="card-title text-truncate">
                    {p.name || "Untitled"}
                  </h5>

                  <div className="mb-2">
                    <span className="fw-bold text-danger me-2">
                      $
                      {typeof p.price === "number"
                        ? p.price.toFixed(2)
                        : p.price}
                    </span>
                    {p.originalPrice && (
                      <>
                        <span className="text-muted text-decoration-line-through me-2">
                          ${p.originalPrice.toFixed(2)}
                        </span>
                        <span className="badge bg-warning text-dark">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>

                  {p.badge && (
                    <span className="badge bg-primary me-2 mb-2">
                      {p.badge}
                    </span>
                  )}

                  {p.rating != null && (
                    <p className="text-muted small mb-2">
                      ⭐ {p.rating.toFixed(1)} (
                      {p.reviewCount?.toLocaleString() || 0})
                    </p>
                  )}

                  {p.description && (
                    <p
                      className="card-text small text-truncate"
                      title={p.description}
                    >
                      {p.description}
                    </p>
                  )}
                  {p.details && (
                    <p
                      className="card-text small text-muted text-truncate"
                      title={p.details}
                    >
                      {p.details}
                    </p>
                  )}

                  <p className="mb-1 small text-muted">
                    <strong>Category:</strong> {p.category}
                  </p>
                  <p className="mb-3 small text-muted">
                    <strong>Seller:</strong> {p.seller} — {p.location}
                  </p>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="btn btn-sm btn-outline-primary w-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await deleteProduct(p.id);
                        load();
                      }}
                      className="btn btn-sm btn-outline-danger w-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
