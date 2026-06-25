import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const getUsers = async () => {
  const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'));
  const usersSnap = await getDocs(usersQuery);
  return usersSnap.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

export const createUserDoc = async (userData) => {
  const authUid = userData.authUid.trim();
  const newDocRef = doc(usersCollection, authUid);
  const now = serverTimestamp();
  await setDoc(newDocRef, {
    email: userData.email,
    displayName: userData.displayName || '',
    role: userData.role || 'customer',
    createdAt: now,
    updatedAt: now,
  });
  return { id: newDocRef.id, ...userData };
};

export const updateUserDoc = async (userId, updates) => {
  await updateDoc(doc(db, 'users', userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteUserDoc = async (userId) => {
  await deleteDoc(doc(db, 'users', userId));
};
