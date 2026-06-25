import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, collection, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';
import { logAuditEvent } from '../services/auditService';
import { ErrorAlert } from '../components/ErrorAlert';
import { SuccessAlert } from '../components/SuccessAlert';

export const ProductForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user } = useAuth();
  const isEdit = !!productId;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    imageUrl: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const loadProduct = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'products', productId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            price: data.price || '',
            description: data.description || '',
            image: null,
            imageUrl: data.image || '',
          });
          if (data.image) {
            setImagePreview(data.image);
          }
        }
      } catch (error) {
        setErrorMsg('Failed to load product');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [productId, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result || '');
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration is missing. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'products');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error('Cloudinary upload failed:', data);
      throw new Error(data.error?.message || 'Cloudinary image upload failed.');
    }

    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name || !formData.price || !formData.description) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        image: imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        // Update existing product
        await updateDoc(doc(db, 'products', productId), productData);
        setSuccessMsg('Product updated successfully');
        void logAuditEvent({
          actorId: user?.uid,
          actorEmail: user?.email,
          actionType: 'product.updated',
          entityType: 'product',
          entityId: productId,
          entityName: formData.name,
          details: `Product updated: ${formData.name}`,
        }).catch((auditError) => console.error('Failed to log audit event:', auditError));
      } else {
        // Create new product
        productData.createdAt = serverTimestamp();
        const newDocRef = doc(collection(db, 'products'));
        await setDoc(newDocRef, productData);
        setSuccessMsg('Product created successfully');
        void logAuditEvent({
          actorId: user?.uid,
          actorEmail: user?.email,
          actionType: 'product.created',
          entityType: 'product',
          entityId: newDocRef.id,
          entityName: formData.name,
          details: `Product created: ${formData.name}`,
        }).catch((auditError) => console.error('Failed to log audit event:', auditError));
      }

      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      setErrorMsg('Failed to save product');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin">
            <div className="h-12 w-12 border-4 border-primary-900 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <SuccessAlert message={successMsg} onDismiss={() => setSuccessMsg('')} />
      <ErrorAlert message={errorMsg} onDismiss={() => setErrorMsg('')} />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-primary-900 hover:text-primary-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>

        {/* Form Card */}
        <div className="card p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Hot Chili Sauce"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (ZMK) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base resize-none"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-64 object-cover rounded-lg mb-4"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition">
                      <Upload size={18} />
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to upload image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting
                ? isEdit
                  ? 'Updating Product...'
                  : 'Creating Product...'
                : isEdit
                ? 'Update Product'
                : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
