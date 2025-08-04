import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { ProductForm } from "./ProductForm";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const items = await getAllProducts();
    setProducts(items);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {editing ? "Edit Product" : "New Product"}
      </h2>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <ProductForm
          existing={editing}
          onSaved={() => {
            load();
            setEditing(null);
          }}
        />
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">All Products</h2>
      <div className="">
        <ul className="space-y-6 ">
          {products.map((p) => (
            <li
              key={p.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-start sm:space-x-4 transition hover:shadow-md"
            >
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              <div className="flex-1 space-y-1 mt-4 sm:mt-0">
                <h3 className="text-base font-semibold text-gray-900">
                  {p.name}
                </h3>
                <p className="text-red-500 font-semibold text-lg">
                  ${p.price}
                  {p.originalPrice && (
                    <span className="text-gray-400 line-through ml-2 text-sm">
                      ${p.originalPrice}
                    </span>
                  )}
                </p>

                {p.badge && (
                  <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium mr-2">
                    {p.badge}
                  </span>
                )}

                {p.discount && (
                  <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                    -{p.discount}%
                  </span>
                )}

                {p.rating && (
                  <p className="text-xs text-yellow-600">
                    ⭐ {p.rating} ({p.reviewCount} reviews)
                  </p>
                )}

                <p className="text-xs text-gray-500">{p.description}</p>
                <p className="text-[11px] text-gray-400">{p.details}</p>

                <p className="text-xs text-gray-500">
                  Category: <span className="text-gray-700">{p.category}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Seller: <span className="text-gray-700">{p.seller}</span> —{" "}
                  {p.location}
                </p>

                <div className="flex mt-2 space-x-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await deleteProduct(p.id);
                      load();
                    }}
                    className="text-xs px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
