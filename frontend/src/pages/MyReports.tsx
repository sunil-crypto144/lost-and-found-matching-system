import React, { useEffect, useState } from 'react';
import { itemService } from '../services/api';
import { Item } from '../types';
import { ItemCard } from '../components/ItemCard';
import { FileText, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyReports: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const data = await itemService.getMyItems();
        setItems(data);
      } catch (err) {
        console.error("Failed to load my reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading your reports...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Reports</h1>
          <p className="text-sm text-slate-400">All lost and found items submitted under your account</p>
        </div>

        <div className="flex space-x-3">
          <Link
            to="/report-lost"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            + Report Lost
          </Link>
          <Link
            to="/report-found"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            + Report Found
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto stroke-1" />
          <p className="text-base text-slate-300 font-semibold">You have not submitted any item reports yet.</p>
          <p className="text-xs text-slate-500">Report a lost or found item to enable automatic engine matching.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
