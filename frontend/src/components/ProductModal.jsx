/**
 * ProductModal.jsx - Modal form for adding or editing products.
 * Only accessible to Admin users (enforced on backend + frontend).
 */

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productAPI } from '../services/api';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Toys', 'Books', 'Sports', 'Beauty', 'Automotive'];

const emptyProduct = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'Electronics', brand: '', imageUrl: '',
  stock: '', rating: '', reviewCount: '', featured: false,
};

export default function ProductModal({ product, onClose, onSaved }) {
  const isEditing = !!product?.id;
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || 'Electronics',
        brand: product.brand || '',
        imageUrl: product.imageUrl || '',
        stock: product.stock || '',
        rating: product.rating || '',
        reviewCount: product.reviewCount || '',
        featured: product.featured || false,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = 'Valid price is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      stock: form.stock ? parseInt(form.stock) : 0,
      rating: form.rating ? parseFloat(form.rating) : 0,
      reviewCount: form.reviewCount ? parseInt(form.reviewCount) : 0,
    };

    try {
      if (isEditing) {
        await productAPI.update(product.id, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product added!');
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, span }) => (
    <div className="form-group" style={span ? { gridColumn: '1/-1' } : {}}>
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        step={type === 'number' ? 'any' : undefined}
      />
      {errors[name] && <p className="text-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="profile-grid">
              <Field name="name" label="Product Name *" placeholder="e.g. iPhone 15 Pro" span />
              <Field name="brand" label="Brand" placeholder="e.g. Apple" />

              {/* Category dropdown */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: '#1a1a35', color: 'white' }}>{c}</option>
                  ))}
                </select>
              </div>

              <Field name="stock" label="Stock Qty" type="number" placeholder="0" />
              <Field name="price" label="Price ($) *" type="number" placeholder="0.00" />
              <Field name="originalPrice" label="Original Price ($)" type="number" placeholder="0.00" />
              <Field name="rating" label="Rating (1–5)" type="number" placeholder="4.5" />
              <Field name="reviewCount" label="Review Count" type="number" placeholder="0" />
              <Field name="imageUrl" label="Image URL" placeholder="https://..." span />

              {/* Description textarea */}
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  name="description"
                  placeholder="Brief product description..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  style={{ resize: 'vertical', minHeight: 80 }}
                />
              </div>

              {/* Featured checkbox */}
              <div className="form-group" style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent-red)', cursor: 'pointer' }}
                />
                <label htmlFor="featured" style={{ fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer', margin: 0 }}>
                  Mark as Featured (shown in homepage banner)
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}
              style={{ width: 'auto', minWidth: 100 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: 'auto', minWidth: 140 }}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
