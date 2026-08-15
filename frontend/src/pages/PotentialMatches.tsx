import React, { useEffect, useState } from 'react';
import { matchService } from '../services/api';
import { Match, MatchStatus } from '../types';
import { MatchCard } from '../components/MatchCard';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export const PotentialMatches: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'ALL'>('ALL');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await matchService.getMatches(statusFilter !== 'ALL' ? statusFilter : undefined);
      setMatches(data);
    } catch (err) {
      console.error("Failed to load matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [statusFilter]);

  const handleConfirm = async (id: number) => {
    try {
      await matchService.confirmMatch(id);
      fetchMatches();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to confirm match.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await matchService.rejectMatch(id);
      fetchMatches();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to reject match.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <span>Potential Engine Matches</span>
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400">Review AI-calculated similarity matches and score breakdowns</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="glass-input rounded-xl py-2 px-4 text-xs font-semibold text-white bg-slate-900"
        >
          <option value="ALL">All Match Statuses</option>
          <option value="SUGGESTED">Suggested Only</option>
          <option value="ACCEPTED">Confirmed Only</option>
          <option value="REJECTED">Rejected Only</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading matching engine results...</div>
      ) : matches.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-xs text-slate-400">
          No matches found under this filter.
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map(m => (
            <MatchCard
              key={m.id}
              match={m}
              onConfirm={handleConfirm}
              onReject={handleReject}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
