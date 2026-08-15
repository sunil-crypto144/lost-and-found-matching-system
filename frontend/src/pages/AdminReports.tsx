import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { Item } from '../types';
import { Trash2, Mail, User } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await adminService.getReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to load admin reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await adminService.deleteReport(id);
      fetchReports();
    } catch (err) {
      alert("Failed to delete report.");
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading reports...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Report Moderation & Contact Directory</h1>
        <p className="text-sm text-slate-400">Inspect reporter contact details and moderate all active lost and found reports</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Type</th>
              <th className="p-4">Item Name</th>
              <th className="p-4">Reporter Name</th>
              <th className="p-4">Reporter Contact</th>
              <th className="p-4">Category</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {reports.map(r => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-slate-500">#{r.id}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.type === 'LOST' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {r.type}
                  </span>
                </td>
                <td className="p-4 font-semibold text-white">{r.name}</td>
                <td className="p-4">{r.reporter_name}</td>
                <td className="p-4 font-mono text-blue-400">{r.reporter_contact}</td>
                <td className="p-4">{r.category}</td>
                <td className="p-4 truncate max-w-xs">{r.location}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400">
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
