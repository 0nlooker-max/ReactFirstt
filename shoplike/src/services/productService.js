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
  // orderData: { items: [{id, name, price, quantity}], subtotal, tax, grandTotal, customerInfo }
  // Calculate estimated delivery date (5 days from now)
  const currentDate = new Date();
  const deliveryDate = new Date(currentDate);
  deliveryDate.setDate(currentDate.getDate() + 5);
  
  // Generate a tracking number
  const trackingNumber = 'TRK' + Math.floor(100000 + Math.random() * 900000);
  
  // Ensure all required fields are present
  const completeOrderData = {
    ...orderData,
    subtotal: orderData.subtotal || 0,
    tax: orderData.tax || 0,
    grandTotal: orderData.grandTotal || 0,
    trackingNumber,
    orderDate: currentDate.toISOString().split('T')[0],
    estimatedDelivery: deliveryDate.toISOString().split('T')[0],
    status: 'Processing',
    createdAt: Date.now(),
  };
  
  const ref = await addDoc(ordersCol, completeOrderData);
  return ref.id;
}

// Add a cart item to Firestore
const cartItemsCol = collection(db, 'cartItems');
export async function addCartItem(cartItem) {
  // cartItem: { productId, name, price, quantity, image, seller, etc. }
  const ref = await addDoc(cartItemsCol, {
    ...cartItem,
    addedAt: Date.now(),
    selected: false, // Add selected field for checkout selection
  });
  return ref.id;
}

// Get all cart items from Firestore
export async function getCartItems() {
  const snapshot = await getDocs(cartItemsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Delete a cart item from Firestore
export async function deleteCartItem(id) {
  const ref = doc(db, 'cartItems', id);
  await deleteDoc(ref);
}

// Update a cart item in Firestore
export async function updateCartItem(id, data) {
  const ref = doc(db, 'cartItems', id);
  await updateDoc(ref, data);
}

// Delete multiple cart items from Firestore
export async function deleteCartItems(ids) {
  const promises = ids.map(id => deleteCartItem(id));
  await Promise.all(promises);
}

// Get all orders from Firestore
export async function getAllOrders() {
  const snapshot = await getDocs(ordersCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get order by tracking number
export async function getOrderByTrackingNumber(trackingNumber) {
  const snapshot = await getDocs(ordersCol);
  const match = snapshot.docs.find(doc => doc.data().trackingNumber === trackingNumber);
  return match ? { id: match.id, ...match.data() } : null;
}