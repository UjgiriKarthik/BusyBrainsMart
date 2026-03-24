/**
 * ProductCard.jsx - Displays a single product with image, rating, price.
 *
 * Admin users see Edit and Delete buttons on hover.
 * Discount % is auto-calculated from originalPrice vs price.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

function StarRating({ rating = 0 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= Math.round(rating) ? '' : 'empty'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductCard({ product, onEdit, onDelete }) {
  const { isAdmin } = useAuth();

  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      onDelete(product.id);
    }
  };

  return (
    <div
      className="product-card"
      style={{ animationDelay: `${Math.random() * 0.2}s` }}
    >
      {/* Image */}
      <div className="product-img-wrap">
        <img
          className="product-img"
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/300`}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${product.id || 'default'}/400/300`;
          }}
        />

        {/* Badges */}
        {product.featured && <span className="product-badge featured">⭐ Featured</span>}
        {discountPct > 0 && !product.featured && (
          <span className="product-badge sale">{discountPct}% OFF</span>
        )}

        {/* Admin hover actions */}
        {isAdmin() && (
          <div className="product-admin-actions">
            <button
              className="btn-icon"
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
              title="Edit product"
              style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              className="btn-icon"
              onClick={handleDelete}
              title="Delete product"
              style={{ background: 'rgba(233,69,96,0.15)', borderColor: 'rgba(233,69,96,0.3)', color: '#e94560' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="product-body">
        <div className="product-brand">{product.brand || product.category}</div>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <StarRating rating={product.rating || 4} />
          <span className="rating-count">
            ({(product.reviewCount || 0).toLocaleString()})
          </span>
        </div>

        <div className="product-footer">
          <div className="product-pricing">
            <span className="product-price">${product.price?.toFixed(2)}</span>
            {discountPct > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="product-original-price">
                  ${product.originalPrice?.toFixed(2)}
                </span>
                <span className="product-discount">↓ {discountPct}% off</span>
              </div>
            )}
          </div>

          <button className="add-to-cart-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
