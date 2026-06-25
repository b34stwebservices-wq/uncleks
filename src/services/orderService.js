import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const ordersCollection = collection(db, 'orders');

export const createOrder = async (orderData) => {
  const orderRef = await addDoc(ordersCollection, orderData);
  return orderRef.id;
};

export const getOrdersForUser = async (userId) => {
  const userOrdersQuery = query(
    ordersCollection,
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(userOrdersQuery);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });
};
