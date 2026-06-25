import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { Edit2, Trash2, Plus, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import { logAuditEvent } from '../services/auditService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SuccessAlert } from '../components/SuccessAlert';
import { ErrorAlert } from '../components/ErrorAlert';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const ProductsManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const productsSnap = await getDocs(productsQuery);
      const productsData = productsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      setErrorMsg('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
    };
    void loadProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      // Delete from Firestore. Cloudinary assets are not deleted from the client-side
      // because that requires server-side credentials or a signed Cloudinary API call.
      await deleteDoc(doc(db, 'products', productToDelete.id));
      setSuccessMsg('Product deleted successfully');
      await logAuditEvent({
        actorId: user?.uid,
        actorEmail: user?.email,
        actionType: 'product.deleted',
        entityType: 'product',
        entityId: productToDelete.id,
        entityName: productToDelete.name || `Product ${productToDelete.id.slice(0, 8)}`,
        details: `Product deleted: ${productToDelete.name || productToDelete.id}`,
      });
      fetchProducts();
    } catch (error) {
      setErrorMsg('Failed to delete product');
      console.error(error);
    } finally {
      setProductToDelete(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <SuccessAlert message={successMsg} onDismiss={() => setSuccessMsg('')} />
      <ErrorAlert message={errorMsg} onDismiss={() => setErrorMsg('')} />
      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Delete product"
        message={`Delete "${productToDelete?.name || 'this product'}"? This removes the product record from Firestore but does not delete the Cloudinary image.`}
        confirmLabel="Delete Product"
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDelete}
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/products/new')}
            className="btn-primary sm:w-auto flex items-center justify-center gap-2 w-full"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Products Grid - Mobile First */}
        {products.length === 0 ? (
          <div className="card p-12 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No products yet</p>
            <button
              onClick={() => navigate('/products/new')}
              className="btn-primary inline-block"
            >
              Create First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="card overflow-hidden flex flex-col h-full">
                {/* Product Image */}
                {product.image && (
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <p className="text-2xl font-bold text-accent mb-4">
                      ZMK {product.price?.toFixed(2) || '0.00'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2"
                      >
                        <Edit2 size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="flex-1 btn-secondary bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;
