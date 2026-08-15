import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { itemService, matchService } from '../services/api';
import { Item, Match } from '../types';
import { PlusCircle, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MatchCard } from '../components/MatchCard';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [myItems, myMatches] = await Promise.all([
        itemService.getMyItems(),
        matchService.getMatches()
      ]);
      setItems(myItems);
      setMatches(myMatches);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleConfirmMatch = async (id: number) => {
    try {
      await matchService.confirmMatch(id);
      loadDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to confirm match.");
    }
  };

  const handleRejectMatch = async (id: number) => {
    try {
      await matchService.rejectMatch(id);
      loadDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to reject match.");
    }
  };

  const lostCount = items.filter(i => i.type === 'LOST').length;
  const foundCount = items.filter(i => i.type === 'FOUND').length;
  const potentialCount = matches.filter(m => m.status === 'SUGGESTED').length;
  const confirmedCount = matches.filter(m => m.status === 'ACCEPTED' || m.status === 'RESOLVED').length;

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading your dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-xs text-slate-400">
            Track your lost & found reports and review explainable AI match recommendations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/report-lost"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost</span>
          </Link>
          <Link
            to="/report-found"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Found</span>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-red-500/20 space-y-1">
          <span className="text-xs text-slate-400 font-medium">My Lost Reports</span>
          <div className="text-2xl font-extrabold text-red-400">{lostCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 space-y-1">
          <span className="text-xs text-slate-400 font-medium">My Found Reports</span>
          <div className="text-2xl font-extrabold text-emerald-400">{foundCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Potential Matches</span>
          <div className="text-2xl font-extrabold text-amber-400">{potentialCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-blue-500/20 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Confirmed Matches</span>
          <div className="text-2xl font-extrabold text-blue-400">{confirmedCount}</div>
        </div>
      </div>

      {/* Potential Matches Priority Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Suggested Matches Needing Review</h2>
          </div>
          <Link to="/potential-matches" className="text-xs font-semibold text-blue-400 hover:underline">
            View All Matches &rarr;
          </Link>
        </div>

        {matches.filter(m => m.status === 'SUGGESTED').length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-xs text-slate-400">
            No active match suggestions at this time. New reports are automatically scanned continuously.
          </div>
        ) : (
          <div className="space-y-4">
            {matches.filter(m => m.status === 'SUGGESTED').slice(0, 3).map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onConfirm={handleConfirmMatch}
                onReject={handleRejectMatch}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent My Reports Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">My Active Reports</h2>
          <Link to="/my-reports" className="text-xs font-semibold text-blue-400 hover:underline">
            Manage All Reports &rarr;
          </Link>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {items.slice(0, 5).map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === 'LOST' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-white">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4 truncate max-w-xs">{item.location}</td>
                  <td className="p-4">{item.event_date}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
