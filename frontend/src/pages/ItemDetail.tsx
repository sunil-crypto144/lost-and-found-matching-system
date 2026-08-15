import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { itemService, matchService } from '../services/api';
import { Item, Match } from '../types';
import { MapPin, Calendar, Tag, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { MatchCard } from '../components/MatchCard';

export const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemAndMatches = async () => {
      if (!id) return;
      try {
        const itemData = await itemService.getItemById(parseInt(id));
        setItem(itemData);

        // Fetch matches if user is authenticated
        try {
          const allMatches = await matchService.getMatches();
          const itemMatches = allMatches.filter(
            m => m.lost_item_id === itemData.id || m.found_item_id === itemData.id
          );
          setMatches(itemMatches);
        } catch {
          // Unauthenticated or no match permission
        }
      } catch (err) {
        console.error("Failed to load item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndMatches();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading item details...</div>;
  }

  if (!item) {
    return <div className="text-center py-20 text-slate-400">Item not found.</div>;
  }

  const isLost = item.type === 'LOST';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Link to="/search" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search</span>
      </Link>

      <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isLost ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {isLost ? 'LOST REPORT' : 'FOUND REPORT'}
            </span>
            <h1 className="text-3xl font-extrabold text-white">{item.name}</h1>
          </div>

          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-blue-400 border border-slate-700">
            STATUS: {item.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-72 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-600 space-y-2">
                <HelpCircle className="w-12 h-12 stroke-1" />
                <span className="text-xs">No image provided</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 rounded-xl p-4 border border-slate-800">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-200">{item.category}</span>
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Brand</span>
                <span className="font-semibold text-slate-200">{item.brand || 'N/A'}</span>
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Color</span>
                <span className="font-semibold text-slate-200">{item.color || 'N/A'}</span>
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Event Date</span>
                <span className="font-semibold text-slate-200">{item.event_date}</span>
              </div>
            </div>

            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-slate-500 block">Location Area</span>
              <span className="font-semibold text-slate-200">{item.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Potential Matches Section for Item */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Potential Engine Matches</h2>
          <div className="space-y-4">
            {matches.map(m => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
