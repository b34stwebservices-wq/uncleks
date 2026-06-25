import { useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getErrorMessage } from '../utils/helpers';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'customer'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          const role = userDoc.exists() ? userDoc.data().role || 'customer' : 'customer';

          if (role === 'pending') {
            // Keep pending users signed in so they can see the approval page,
            // while ProtectedRoute prevents access to normal customer/admin pages.
            setUser(authUser);
            setUserRole('pending');
          } else {
            setUser(authUser);
            setUserRole(role);
          }
        } catch (err) {
          console.error('Error fetching user role:', err);
          setUser(authUser);
          setUserRole('customer');
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    setError(null);
    try {
      const normalizedEmail = email.trim();
      const cleanedFullName = fullName?.trim() || '';

      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const newUser = userCredential.user;

      if (cleanedFullName) {
        await updateProfile(newUser, { displayName: cleanedFullName });
      }

      // Store user data in Firestore with pending approval
      await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        displayName: cleanedFullName || '',
        role: 'pending',
        createdAt: new Date(),
      });

      // Sign out the pending user - they cannot log in until approved
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      
      return { uid: newUser.uid, email: newUser.email };
    } catch (err) {
      console.error('Register error:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;

      // Get user role
      const userDoc = await getDoc(doc(db, 'users', authUser.uid));
      const role = userDoc.exists() ? userDoc.data().role || 'customer' : 'customer';

      if (role === 'pending') {
        await signOut(auth);
        throw new Error('pending-approval');
      }

      setUserRole(role);
      return { authUser, role };
    } catch (err) {
      console.error('Login error:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const isAdmin = userRole === 'admin';

  const value = {
    user,
    userRole,
    loading,
    error,
    register,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
