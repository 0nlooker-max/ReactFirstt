import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { ProductForm } from "./ProductForm";
import "../assets/addprdct/ProductList.css";
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
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Original Price</th>
                <th>Discount</th>
                <th>Badge</th>
                <th>Quantity</th>
                <th>Rating</th>
                <th>Description</th>
                <th>Details</th>
                <th>Category</th>
                <th>Seller</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const imageSrc = p.image || p.imageUrl || "";
                const discount = calculateDiscount(p.price, p.originalPrice);
                return (
                  <tr key={p.id}>
                    <td style={{ width: 80 }}>
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={p.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>
                    <td>{p.name || "Untitled"}</td>
                    <td className="text-danger fw-bold">
                      {typeof p.price === "number" && !isNaN(p.price)
                        ? `${p.price.toFixed(2)}`
                        : p.price && !isNaN(Number(p.price))
                        ? `${Number(p.price).toFixed(2)}`
                        : "-"}
                    </td>
                    <td>
                      {typeof p.originalPrice === "number" && !isNaN(p.originalPrice)
                        ? `${p.originalPrice.toFixed(2)}`
                        : p.originalPrice && !isNaN(Number(p.originalPrice))
                        ? `${Number(p.originalPrice).toFixed(2)}`
                        : "-"}
                    </td>
                    <td>
                      {typeof p.originalPrice === "number" && !isNaN(p.originalPrice)
                        ? (
                            <span className="badge bg-warning text-dark">
                              -{discount}%
                            </span>
                          )
                        : p.originalPrice && !isNaN(Number(p.originalPrice))
                        ? (
                            <span className="badge bg-warning text-dark">
                              -{discount}%
                            </span>
                          )
                        : "-"}
                    </td>
                    <td>
                      {p.badge && (
                        <span className="badge bg-primary">{p.badge}</span>
                      )}
                    </td>
                    <td>
                      {typeof p.quantity === "number" && !isNaN(p.quantity)
                        ? p.quantity
                        : p.quantity && !isNaN(Number(p.quantity))
                        ? Number(p.quantity)
                        : 0}
                    </td>
                    <td>
                      {typeof p.rating === "number" && !isNaN(p.rating)
                        ? (
                            <span>
                              ⭐ {p.rating.toFixed(1)}
                              <br />({p.reviewCount && !isNaN(Number(p.reviewCount)) ? Number(p.reviewCount).toLocaleString() : 0})
                            </span>
                          )
                        : p.rating && !isNaN(Number(p.rating))
                        ? (
                            <span>
                              ⭐ {Number(p.rating).toFixed(1)}
                              <br />({p.reviewCount && !isNaN(Number(p.reviewCount)) ? Number(p.reviewCount).toLocaleString() : 0})
                            </span>
                          )
                        : "-"}
                    </td>
                    <td
                      title={p.description}
                      style={{
                        maxWidth: 120,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.description || "-"}
                    </td>
                    <td
                      title={p.details}
                      style={{
                        maxWidth: 120,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.details || "-"}
                    </td>
                    <td>{p.category || "-"}</td>
                    <td>{p.seller || "-"}</td>
                    <td>{p.location || "-"}</td>
                    <td>
                      <button
                        onClick={() => setEditing(p)}
                        className="btn btn-sm btn-outline-primary mb-1 w-100"
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
