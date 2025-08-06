// src/services/productService.js
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  const productsCol = collection(db, 'products');
  const ordersCol = collection(db, 'orders');
  
  export async function createProduct(data) {
    // data: { name, description, price, details }
    const ref = await addDoc(productsCol, {
      ...data,
      createdAt: Date.now()
    });
    return ref.id;
  }
  
  export async function getAllProducts() {
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  export async function updateProduct(id, data) {
    const ref = doc(db, 'products', id);
    await updateDoc(ref, data);
  }
  
  export async function deleteProduct(id) {
    const ref = doc(db, 'products', id);
    await deleteDoc(ref);
  }

  export async function getProduct(id) {
  const ref = doc(db, 'products', id);
  const snapshot = await getDocs(productsCol);
  const match = snapshot.docs.find(doc => doc.id === id);
  return match ? { id: match.id, ...match.data() } : null;
}

// Create an order in Firestore
export async function createOrder(orderData) {
  // orderData: { items: [{id, name, price, quantity}], total, createdAt }
  const ref = await addDoc(ordersCol, {
    ...orderData,
    createdAt: Date.now(),
  });
  return ref.id;
}

// Add a cart item to Firestore
const cartItemsCol = collection(db, 'cartItems');
export async function addCartItem(cartItem) {
  // cartItem: { productId, name, price, quantity, addedAt }
  const ref = await addDoc(cartItemsCol, {
    ...cartItem,
    addedAt: Date.now(),
  });
  return ref.id;
}

// Get all cart items from Firestore
export async function getCartItems() {
  const snapshot = await getDocs(cartItemsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}