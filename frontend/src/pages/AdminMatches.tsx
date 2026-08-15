import React, { useEffect, useState } from 'react';
import { adminService, matchService } from '../services/api';
import { Match, MatchStatus } from '../types';
import { MatchCard } from '../components/MatchCard';
import { Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MatchStatus | 'ALL'>('ALL');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMatches();
      setMatches(data);
    } catch (err) {
      console.error("Failed to load admin matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      await matchService.confirmMatch(id);
      fetchMatches();
    } catch (err) {
      alert("Failed to confirm match.");
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await matchService.resolveMatch(id);
      fetchMatches();
    } catch (err) {
      alert("Failed to mark item as retrieved.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await matchService.rejectMatch(id);
      fetchMatches();
    } catch (err) {
      alert("Failed to reject match.");
    }
  };

  const filteredMatches = filter === 'ALL' 
    ? matches 
    : matches.filter(m => m.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span>Match Monitoring Stream</span>
          </h1>
          <p className="text-sm text-slate-400">
            Real-time scoring analysis and item resolution control across all reports
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/retrieved"
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>View Retrieved Archive</span>
          </Link>

          <button
            onClick={fetchMatches}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {(['ALL', 'SUGGESTED', 'ACCEPTED', 'RESOLVED', 'REJECTED'] as const).map((statusKey) => (
          <button
            key={statusKey}
            onClick={() => setFilter(statusKey)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === statusKey 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {statusKey === 'ALL' ? 'All Matches' : statusKey}
          </button>
        ))}
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading system matches...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-xs">
          No matches found for the selected status.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMatches.map(m => (
            <MatchCard
              key={m.id}
              match={m}
              onConfirm={handleConfirm}
              onResolve={handleResolve}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};
