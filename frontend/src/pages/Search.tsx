import React, { useState, useEffect } from 'react';
import { itemService } from '../services/api';
import { Item, ItemType } from '../types';
import { ItemCard } from '../components/ItemCard';
import { Search as SearchIcon, Filter, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Documents',
  'Clothing',
  'Bags',
  'Accessories',
  'Keys',
  'Books',
  'ID Cards',
  'Other'
];

export const Search: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState<ItemType | 'ALL'>('ALL');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params: any = { sort_by: sortBy };
      if (query.trim()) params.query = query.trim();
      if (category !== 'All') params.category = category;
      if (type !== 'ALL') params.type = type;
      if (location.trim()) params.location = location.trim();

      const data = await itemService.searchItems(params);
      setItems(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, type, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Search Items</h1>
        <p className="text-sm text-slate-400">Search and filter reported lost and found items</p>
      </div>

      {/* Filter and Search Form */}
      <form onSubmit={handleSearchSubmit} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand, description..."
              className="w-full glass-input rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full glass-input rounded-xl py-2 px-3 text-sm text-white bg-slate-900"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Report Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full glass-input rounded-xl py-2 px-3 text-sm text-white bg-slate-900"
            >
              <option value="ALL">All Reports</option>
              <option value="LOST">Lost Reports Only</option>
              <option value="FOUND">Found Reports Only</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Location Area</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Central Park"
              className="w-full glass-input rounded-xl py-2 px-3 text-sm text-white"
            />
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full glass-input rounded-xl py-2 px-3 text-sm text-white bg-slate-900"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </form>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Searching matching database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <p className="text-base text-slate-300 font-semibold">No items matched your search criteria.</p>
          <p className="text-xs text-slate-500">Try broadening your search keywords or clearing filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-medium">
            Found <span className="text-white font-bold">{items.length}</span> matching report{items.length !== 1 && 's'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
