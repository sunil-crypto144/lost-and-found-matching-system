import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { AdminStats, Item } from '../types';
import { Shield, Search, FileText, Sparkles, Users, Trash2, RefreshCw, CheckCircle2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<Item[]>([]);
  const [filteredReports, setFilteredReports] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'MATCHED' | 'RESOLVED'>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, reportsData] = await Promise.all([
        adminService.getStats(),
        adminService.getReports()
      ]);
      setStats(statsData);
      setReports(reportsData);
      setFilteredReports(reportsData);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    let result = reports;
    if (typeFilter !== 'ALL') {
      result = result.filter(r => r.type === typeFilter);
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(r => r.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.reporter_name.toLowerCase().includes(q) ||
        r.reporter_contact.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    setFilteredReports(result);
  }, [searchQuery, typeFilter, statusFilter, reports]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete report #${id}?`)) return;
    try {
      await adminService.deleteReport(id);
      fetchAdminData();
    } catch (err) {
      alert("Failed to delete report.");
    }
  };

  if (loading && !stats) {
    return <div className="text-center py-20 text-slate-400">Loading admin control panel...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Administrator Control Panel</h1>
            <p className="text-xs sm:text-sm text-slate-400">All submissions, contact details, and item resolutions monitored here in real time</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/retrieved"
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Award className="w-4 h-4" />
            <span>Retrieved Archive</span>
          </Link>

          <button
            onClick={fetchAdminData}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-purple-500/20 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
            <div className="text-3xl font-extrabold text-purple-400">{stats.total_users}</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-red-500/20 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Lost Reports</span>
            <div className="text-3xl font-extrabold text-red-400">{stats.total_lost_reports}</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Found Reports</span>
            <div className="text-3xl font-extrabold text-emerald-400">{stats.total_found_reports}</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-blue-500/20 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Potential Matches</span>
            <div className="text-3xl font-extrabold text-blue-400">{stats.total_potential_matches}</div>
          </div>
        </div>
      )}

      {/* Direct Report Stream & Moderation Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>All Submitted Lost & Found Reports ({filteredReports.length})</span>
            </h2>
            <p className="text-xs text-slate-400">Complete database records with reporter names, phone numbers, and emails</p>
          </div>

          {/* Quick Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, item..."
                className="glass-input rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 w-44 sm:w-52"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="glass-input rounded-xl py-1.5 px-3 text-xs text-white bg-slate-900"
            >
              <option value="ALL">All Types</option>
              <option value="LOST">Lost Reports</option>
              <option value="FOUND">Found Reports</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="glass-input rounded-xl py-1.5 px-3 text-xs text-white bg-slate-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open (Active)</option>
              <option value="MATCHED">Matched</option>
              <option value="RESOLVED">Resolved (Retrieved)</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Item Name</th>
                <th className="p-3.5">Reporter Name</th>
                <th className="p-3.5">Contact (Email / Phone)</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    No reports match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map(r => (
                  <tr key={r.id} className={`hover:bg-slate-800/40 transition-colors ${r.status === 'RESOLVED' ? 'opacity-70 bg-emerald-950/10' : ''}`}>
                    <td className="p-3.5 text-slate-500 font-mono">#{r.id}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.type === 'LOST' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className={`p-3.5 font-bold text-white max-w-[180px] truncate ${r.status === 'RESOLVED' ? 'line-through text-slate-400' : ''}`}>
                      {r.name}
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">{r.reporter_name}</td>
                    <td className="p-3.5 font-mono text-blue-400">{r.reporter_contact}</td>
                    <td className="p-3.5">{r.category}</td>
                    <td className="p-3.5 max-w-[140px] truncate">{r.location}</td>
                    <td className="p-3.5 text-slate-400">{r.event_date}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        r.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        r.status === 'MATCHED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {r.status === 'RESOLVED' ? '✓ RETRIEVED' : r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/retrieved" className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Retrieved Archive</h3>
          <p className="text-xs text-slate-400">View permanent records of who lost it and who found it for successfully resolved items.</p>
        </Link>

        <Link to="/admin/matches" className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Match Monitoring</h3>
          <p className="text-xs text-slate-400">Inspect automated similarity scoring across all active items and mark them collected.</p>
        </Link>

        <Link to="/admin/users" className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">User Management</h3>
          <p className="text-xs text-slate-400">View administrator accounts and user registration logs.</p>
        </Link>
      </div>
    </div>
  );
};
