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

const badgesCol = collection(db, "badges");

export async function getAllBadges() {
  const q = query(badgesCol, orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createBadge(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Badge name cannot be empty");
  const ref = await addDoc(badgesCol, {
    name: trimmed,
    createdAt: Date.now(),
  });
  return { id: ref.id, name: trimmed, createdAt: Date.now() };
}

export async function deleteBadge(id) {
  const ref = doc(db, "badges", id);
  await deleteDoc(ref);
}
