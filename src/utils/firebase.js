// Firebase query helpers
import { query, where, orderBy, limit } from 'firebase/firestore';

/**
 * Build a query for products with optional filters
 */
export const buildProductQuery = (collection, filters = {}) => {
  const conditions = [];

  if (filters.minPrice !== undefined) {
    conditions.push(where('price', '>=', filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(where('price', '<=', filters.maxPrice));
  }

  if (filters.search) {
    // Note: Firestore doesn't have full-text search, this is basic filtering
    // For production, consider Algolia or similar
    conditions.push(where('name', '>=', filters.search));
    conditions.push(where('name', '<=', `${filters.search}\uf8ff`));
    conditions.push(orderBy('name'));
  }

  conditions.push(orderBy('createdAt', 'desc'));

  if (filters.limit) {
    conditions.push(limit(filters.limit));
  }

  return query(collection, ...conditions);
};

/**
 * Build a query for orders with optional filters
 */
export const buildOrderQuery = (collection, filters = {}) => {
  const conditions = [];

  if (filters.status) {
    conditions.push(where('status', '==', filters.status));
  }

  if (filters.customerId) {
    conditions.push(where('customerId', '==', filters.customerId));
  }

  conditions.push(orderBy('createdAt', 'desc'));

  if (filters.limit) {
    conditions.push(limit(filters.limit));
  }

  return query(collection, ...conditions);
};

/**
 * Transform Firestore document to plain object
 */
export const docToObject = (doc) => {
  return {
    id: doc.id,
    ...doc.data(),
  };
};

/**
 * Transform multiple Firestore documents
 */
export const docsToObjects = (docs) => {
  return docs.map(docToObject);
};
