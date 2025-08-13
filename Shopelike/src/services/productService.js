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
    return snapshot.docs.map(doc => ({ 
      id: doc.id, // Explicitly include the Firestore document ID
      ...doc.data() 
    }));
  }
  
  export async function updateProduct(id, data) {
  try {
    const ref = doc(db, 'products', id);
    await updateDoc(ref, data);
    return true;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    // Rethrow the error so the caller can handle it
    throw error;
  }
  }
  
  export async function deleteProduct(id) {
    const ref = doc(db, 'products', id);
    await deleteDoc(ref);
  }

  import { getDoc } from 'firebase/firestore';

export async function getProduct(id) {
  try {
    if (!id) {
      console.warn('Attempted to get product with undefined or null ID');
      return null;
    }
    
    const ref = doc(db, 'products', id);
    const snapshot = await getDoc(ref);
    
    if (!snapshot.exists()) {
      console.warn(`Product with ID ${id} not found. It may have been deleted or never existed.`);
      return null;
    }
    
    // Ensure numeric fields are returned as numbers
    const data = snapshot.data();
    return { 
      id: snapshot.id, // Explicitly include the Firestore document ID
      ...data,
      quantity: data.quantity !== undefined ? Number(data.quantity) : 0,
      price: data.price !== undefined ? Number(data.price) : 0
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    // Return null instead of throwing to make the function more resilient
    return null;
  }
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
    selected: false, 
  });
  return ref.id;
}

// Get all cart items from Firestore
export async function getCartItems() {
  try {
    const snapshot = await getDocs(cartItemsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    // Return empty array instead of failing completely
    return [];
  }
}
export async function deleteAllProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'));

  const deletePromises = querySnapshot.docs.map((document) =>
    deleteDoc(doc(db, 'products', document.id))
  );
  await Promise.all(deletePromises);
  console.log("All products deleted successfully.");
}
// Delete a cart item from Firestore
export async function deleteCartItem() {
  const ref = doc(db, 'products')
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