/**
 * DashboardPage.jsx - Main product listing page.
 *
 * Features:
 * - Hero banner with stats
 * - Search bar (real-time filter)
 * - Category filter chips
 * - Product grid with cards
 * - Admin: Add / Edit / Delete product buttons
 * - Role info banner (admin vs user experience)
 */

import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Load all products and categories on mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getAll();
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await productAPI.getCategories();
      setCategories(['All', ...data]);
    } catch {
      setCategories(['All']);
    }
  };

  // Client-side filtering: search + category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Delete failed — check your permissions');
    }
  };

  const handleModalSaved = () => {
    loadProducts();
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="dashboard">
      <Navbar onAddProduct={handleAddProduct} />

      {/* Hero Banner */}
      <div className="dashboard-hero">
        <h1 className="hero-title">
          Discover <em>Amazing</em> Products
        </h1>
        <p className="hero-subtitle">
          {isAdmin()
            ? 'Manage your product catalog with full Admin controls'
            : 'Browse our curated collection of top-rated products'}
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">{products.length}+</div>
            <div className="hero-stat-label">Products</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">{categories.length - 1}</div>
            <div className="hero-stat-label">Categories</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">${Math.round(totalValue / 100) * 100 / 1000}K+</div>
            <div className="hero-stat-label">Total Value</div>
          </div>
        </div>

        {/* Role info banner */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginTop: 24, padding: '8px 20px',
          background: isAdmin() ? 'rgba(233,69,96,0.12)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${isAdmin() ? 'rgba(233,69,96,0.25)' : 'rgba(16,185,129,0.2)'}`,
          borderRadius: 50, fontSize: 13, position: 'relative',
          color: isAdmin() ? 'var(--accent-red)' : 'var(--accent-green)',
        }}>
          {isAdmin() ? '👑' : '👤'} Logged in as{' '}
          <strong>{user?.username}</strong> —{' '}
          {isAdmin() ? 'You can add, edit & delete products' : 'View-only access'}
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="controls-bar">
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search products, brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {searchTerm && (
          <div className="controls-right">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="products-section">
        <div className="section-header">
          <div>
            <span className="section-title">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </span>
            <span className="section-count">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="loading-spinner" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No products found</div>
            <div className="empty-state-text">
              {searchTerm
                ? `No results for "${searchTerm}". Try a different search.`
                : 'No products in this category yet.'}
            </div>
            {isAdmin() && (
              <button className="btn btn-primary" onClick={handleAddProduct}
                style={{ width: 'auto', marginTop: 20 }}>
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Admin Product Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  );
}
