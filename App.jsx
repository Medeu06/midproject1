import React, { useState, useEffect, useMemo } from 'react';
import { fakeApi } from './fakeApi.js';
import { CATEGORIES } from './initial-data-sample.js';
import { API_CONFIG } from './settings.js';

// --- COMPONENT 1: Navbar ---
function Navbar({ totalCount, onResetData, onOpenAddModal }) {
  return (
    <header className="sticky top-0 z-30 glass-nav border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-black text-white">S</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">StartHub</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Directory
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Curated SaaS & Tech Startup Database</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Total Startups: <strong className="ml-1 text-indigo-400">{totalCount}</strong>
          </span>
          <button
            onClick={onResetData}
            title="Reset dataset to initial 105 records"
            className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center space-x-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>List Startup</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// --- COMPONENT 2: StatsSummary ---
function StatsSummary({ items }) {
  const stats = useMemo(() => {
    if (!items.length) return { totalMrr: 0, avgRating: 0, topCategory: 'N/A' };
    const totalMrr = items.reduce((acc, curr) => acc + (curr.mrr || 0), 0);
    const avgRating = (items.reduce((acc, curr) => acc + (curr.rating || 0), 0) / items.length).toFixed(1);

    const categoryCounts = items.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});
    const topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, 'N/A');

    return { totalMrr, avgRating, topCategory };
  }, [items]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="glass-card p-4 rounded-xl border border-slate-800">
        <p className="text-xs text-slate-400 font-medium">Total Listed</p>
        <p className="text-xl sm:text-2xl font-black text-white mt-1">{items.length}</p>
        <p className="text-[11px] text-indigo-400 mt-1">Startups in directory</p>
      </div>
      <div className="glass-card p-4 rounded-xl border border-slate-800">
        <p className="text-xs text-slate-400 font-medium">Combined Platform MRR</p>
        <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">${(stats.totalMrr / 1000).toFixed(1)}k</p>
        <p className="text-[11px] text-emerald-500/80 mt-1">Monthly Recurring Revenue</p>
      </div>
      <div className="glass-card p-4 rounded-xl border border-slate-800">
        <p className="text-xs text-slate-400 font-medium">Average Rating</p>
        <div className="flex items-center space-x-1.5 mt-1">
          <p className="text-xl sm:text-2xl font-black text-amber-400">{stats.avgRating}</p>
          <span className="text-amber-400 text-sm">★</span>
        </div>
        <p className="text-[11px] text-amber-500/80 mt-1">User satisfaction score</p>
      </div>
      <div className="glass-card p-4 rounded-xl border border-slate-800">
        <p className="text-xs text-slate-400 font-medium">Top Active Sector</p>
        <p className="text-base sm:text-lg font-bold text-purple-300 mt-1 truncate">{stats.topCategory}</p>
        <p className="text-[11px] text-purple-400/80 mt-1">Most startups registered</p>
      </div>
    </div>
  );
}

// --- COMPONENT 3: FilterBar ---
function FilterBar({
  searchTerm, setSearchTerm,
  selectedCategory, setSelectedCategory,
  sortBy, setSortBy,
  sortOrder, setSortOrder,
  minMrr, setMinMrr,
  minRating, setMinRating,
  onResetFilters
}) {
  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 mb-6 shadow-xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-400 mb-1">Search Startup / Keyword</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, tag, or description..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Category / Industry</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="All">All Categories ({CATEGORIES.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort By & Order */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Sort Field & Order</label>
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="name">Name</option>
              <option value="mrr">MRR ($ USD)</option>
              <option value="rating">Rating</option>
              <option value="foundedYear">Founded Year</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center"
              title={`Current: ${sortOrder.toUpperCase()}. Click to switch.`}
            >
              {sortOrder === 'asc' ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* Minimum MRR Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Min MRR: ${minMrr.toLocaleString()}</label>
          <input
            type="range"
            min="0"
            max="80000"
            step="5000"
            value={minMrr}
            onChange={(e) => setMinMrr(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer mt-2"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400 gap-2">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-slate-400">Min Rating Filter:</span>
          {[0, 3.5, 4.0, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-2 py-1 rounded transition-colors ${
                minRating === r ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r === 0 ? 'Any' : `${r}★+`}
            </button>
          ))}
        </div>

        <button
          onClick={onResetFilters}
          className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center space-x-1"
        >
          <span>Clear all filters</span>
        </button>
      </div>
    </div>
  );
}

// --- COMPONENT 4: StartupCard ---
function StartupCard({ startup, onViewDetail }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-md mb-2">
              {startup.category}
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
              {startup.name}
            </h3>
          </div>
          <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg shrink-0">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-xs font-bold text-amber-300">{startup.rating}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {startup.tagline}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {startup.tags && startup.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Estimated MRR</span>
          <span className="text-sm font-extrabold text-emerald-400">${startup.mrr.toLocaleString()}/mo</span>
        </div>
        <button
          onClick={() => onViewDetail(startup)}
          className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors border border-slate-700 hover:border-indigo-500"
        >
          Details →
        </button>
      </div>
    </div>
  );
}

// --- COMPONENT 5: StartupDetailModal ---
function StartupDetailModal({ startup, onClose }) {
  if (!startup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="glass-card max-w-xl w-full rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800"
        >
          ✕
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            {startup.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{startup.name}</h2>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {startup.category}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-300 font-medium mb-6 italic">
          "{startup.tagline}"
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">MRR</span>
            <span className="text-emerald-400 font-bold text-sm">${startup.mrr.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Rating</span>
            <span className="text-amber-400 font-bold text-sm">★ {startup.rating} / 5.0</span>
          </div>
          <div>
            <span className="text-slate-500 block">Founded</span>
            <span className="text-slate-200 font-bold text-sm">{startup.foundedYear}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Team Size</span>
            <span className="text-slate-200 font-bold text-sm">{startup.teamSize || 'N/A'} members</span>
          </div>
          <div>
            <span className="text-slate-500 block">Stage</span>
            <span className="text-purple-300 font-bold text-sm">{startup.fundingStage || 'Seed'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">ID</span>
            <span className="text-slate-400 font-mono text-[11px] truncate block">{startup.id}</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Startup</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
            {startup.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <a
            href={startup.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
          >
            <span>Visit Official Website</span>
            <span>↗</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT 6: AddStartupModal (Controlled Form) ---
function AddStartupModal({ isOpen, onClose, onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: CATEGORIES[0],
    mrr: '',
    rating: '4.5',
    foundedYear: '2024',
    tagsInput: '',
    description: '',
    website: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Startup name is required.';
    if (!formData.tagline.trim()) errs.tagline = 'Tagline is required.';
    if (!formData.mrr || isNaN(formData.mrr) || Number(formData.mrr) < 0) errs.mrr = 'Valid positive MRR is required.';
    if (!formData.rating || isNaN(formData.rating) || Number(formData.rating) < 1 || Number(formData.rating) > 5) {
      errs.rating = 'Rating must be between 1.0 and 5.0';
    }
    if (!formData.foundedYear || isNaN(formData.foundedYear) || Number(formData.foundedYear) < 1990 || Number(formData.foundedYear) > 2026) {
      errs.foundedYear = 'Enter a valid year (1990-2026).';
    }
    if (!formData.description.trim() || formData.description.length < 15) {
      errs.description = 'Description must be at least 15 characters long.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedItem = {
        ...formData,
        mrr: Number(formData.mrr),
        rating: Number(formData.rating),
        foundedYear: Number(formData.foundedYear),
        tags: formData.tagsInput ? formData.tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [formData.category, 'SaaS'],
        website: formData.website.trim() || `https://${formData.name.toLowerCase().replace(/\s+/g, '')}.example.com`
      };

      const created = await fakeApi.addItem(formattedItem);
      onAddSuccess(created);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-lg w-full rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white">Add New Startup</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        {errors.submit && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Acme AI"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            {errors.name && <p className="text-[11px] text-red-400 mt-0.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline / Short Pitch *</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Autonomous marketing workflows"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            {errors.tagline && <p className="text-[11px] text-red-400 mt-0.5">{errors.tagline}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">MRR ($ USD) *</label>
              <input
                type="number"
                name="mrr"
                value={formData.mrr}
                onChange={handleChange}
                placeholder="15000"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.mrr && <p className="text-[11px] text-red-400 mt-0.5">{errors.mrr}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (1.0 - 5.0) *</label>
              <input
                type="number"
                step="0.1"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.rating && <p className="text-[11px] text-red-400 mt-0.5">{errors.rating}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Founded Year *</label>
              <input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.foundedYear && <p className="text-[11px] text-red-400 mt-0.5">{errors.foundedYear}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              name="tagsInput"
              value={formData.tagsInput}
              onChange={handleChange}
              placeholder="Automation, Analytics, B2B"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description *</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information regarding product features..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            {errors.description && <p className="text-[11px] text-red-400 mt-0.5">{errors.description}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? <span>Saving...</span> : <span>Create Record</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- COMPONENT 7: Pagination ---
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400 gap-4">
      <div>
        Showing <strong className="text-white">{startItem}</strong> to <strong className="text-white">{endItem}</strong> of <strong className="text-white">{totalItems}</strong> entries
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
          .map((page, index, arr) => {
            const prevPage = arr[index - 1];
            const showEllipsis = prevPage && page - prevPage > 1;

            return (
              <React.Fragment key={page}>
                {showEllipsis && <span className="px-2 text-slate-600">...</span>}
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// --- COMPONENT 8: StateFeedback (Loading, Error, Empty) ---
function StateFeedback({ isLoading, error, isEmpty, onRetry, onResetFilters }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-800 animate-pulse space-y-4">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-6 bg-slate-800 rounded w-3/4"></div>
            <div className="h-10 bg-slate-800/60 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-red-500/30 text-center max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
        <h3 className="text-lg font-bold text-white mb-2">Error Loading Data</h3>
        <p className="text-xs text-slate-400 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="glass-card rounded-2xl p-12 border border-slate-800 text-center max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 text-xl">🔍</div>
        <h3 className="text-lg font-bold text-white mb-1">No Startups Found</h3>
        <p className="text-xs text-slate-400 mb-6">No records match your active search filters or dataset parameters.</p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return null;
}

// --- COMPONENT 9: Toast Notification ---
function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 glass-card border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-up">
      <span className="text-lg">✅</span>
      <span className="text-xs font-semibold">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">✕</button>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter, Sort, Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('mrr');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minMrr, setMinMrr] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Data Fetching with Race-Condition handling
  const fetchStartups = async () => {
    setIsLoading(true);
    setError(null);
    let isMounted = true;

    try {
      const data = await fakeApi.getItems();
      if (isMounted) {
        setStartups(data);
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message || 'Failed to fetch items');
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, sortOrder, minMrr, minRating]);

  // Handle Dataset Reset
  const handleResetData = async () => {
    setIsLoading(true);
    try {
      const freshData = await fakeApi.resetData();
      setStartups(freshData);
      setToastMessage('Database successfully reset to initial 105 records!');
    } catch (e) {
      setError('Failed to reset dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & Sort Calculations
  const filteredAndSortedStartups = useMemo(() => {
    return startups
      .filter((item) => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesMrr = item.mrr >= minMrr;
        const matchesRating = item.rating >= minRating;
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.tagline.toLowerCase().includes(query) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)));

        return matchesCategory && matchesMrr && matchesRating && matchesSearch;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [startups, selectedCategory, minMrr, minRating, searchTerm, sortBy, sortOrder]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredAndSortedStartups.length / API_CONFIG.ITEMS_PER_PAGE);
  const paginatedStartups = useMemo(() => {
    const startIndex = (currentPage - 1) * API_CONFIG.ITEMS_PER_PAGE;
    return filteredAndSortedStartups.slice(startIndex, startIndex + API_CONFIG.ITEMS_PER_PAGE);
  }, [filteredAndSortedStartups, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('mrr');
    setSortOrder('desc');
    setMinMrr(0);
    setMinRating(0);
    setCurrentPage(1);
  };

  const handleAddSuccess = (newStartup) => {
    setStartups((prev) => [newStartup, ...prev]);
    setToastMessage(`"${newStartup.name}" added successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        totalCount={startups.length}
        onResetData={handleResetData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsSummary items={startups} />

        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          minMrr={minMrr}
          setMinMrr={setMinMrr}
          minRating={minRating}
          setMinRating={setMinRating}
          onResetFilters={handleResetFilters}
        />

        {/* Dynamic State Component Handling */}
        <StateFeedback
          isLoading={isLoading}
          error={error}
          isEmpty={!isLoading && !error && paginatedStartups.length === 0}
          onRetry={fetchStartups}
          onResetFilters={handleResetFilters}
        />

        {/* Content List */}
        {!isLoading && !error && paginatedStartups.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedStartups.map((startup) => (
                <StartupCard
                  key={startup.id}
                  startup={startup}
                  onViewDetail={setSelectedStartup}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredAndSortedStartups.length}
              itemsPerPage={API_CONFIG.ITEMS_PER_PAGE}
            />
          </>
        )}
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>StartHub Single Page Application — React Midterm Project</p>
      </footer>

      {/* Modals */}
      <StartupDetailModal
        startup={selectedStartup}
        onClose={() => setSelectedStartup(null)}
      />

      <AddStartupModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={handleAddSuccess}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
