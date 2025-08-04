import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const categoriesCol = collection(db, "categories");

/**
 * Returns array of category objects: { id, name, createdAt }
 */
export async function getAllCategories() {
  const q = query(categoriesCol, orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Creates a new category if name is non-empty.
 * Returns created category object.
 */
export async function createCategory(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Category name cannot be empty");
  const ref = await addDoc(categoriesCol, {
    name: trimmed,
    createdAt: Date.now(),
  });
  return { id: ref.id, name: trimmed, createdAt: Date.now() };
}

/**
 * (Optional) Delete a category by id.
 */
export async function deleteCategory(id) {
  const ref = doc(db, "categories", id);
  await deleteDoc(ref);
}

