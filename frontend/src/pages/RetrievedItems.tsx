import React, { useEffect, useState } from 'react';
import { matchService } from '../services/api';
import { Match } from '../types';
import { 
  CheckCircle2, 
  Search, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Award, 
  Layers, 
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ExplainModal } from '../components/ExplainModal';

export const RetrievedItems: React.FC = () => {
  const [retrievals, setRetrievals] = useState<Match[]>([]);
  const [filteredRetrievals, setFilteredRetrievals] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMatchForExplain, setSelectedMatchForExplain] = useState<Match | null>(null);

  const fetchRetrievals = async () => {
    setLoading(true);
    try {
      const data = await matchService.getResolvedRetrievals();
      setRetrievals(data);
      setFilteredRetrievals(data);
    } catch (err) {
      console.error("Failed to load resolved retrievals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetrievals();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRetrievals(retrievals);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = retrievals.filter(m => 
      m.lost_item.name.toLowerCase().includes(q) ||
      m.found_item.name.toLowerCase().includes(q) ||
      m.lost_item.reporter_name.toLowerCase().includes(q) ||
      m.found_item.reporter_name.toLowerCase().includes(q) ||
      m.lost_item.reporter_contact.toLowerCase().includes(q) ||
      m.found_item.reporter_contact.toLowerCase().includes(q) ||
      m.lost_item.category.toLowerCase().includes(q) ||
      m.lost_item.location.toLowerCase().includes(q)
    );
    setFilteredRetrievals(filtered);
  }, [searchQuery, retrievals]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SUCCESSFULLY REUNITED & HANDED OVER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Successfully Found & Retrieved Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Permanent record of reconnected items with full contact details of who lost it and who found it
          </p>
        </div>

        <button
          onClick={fetchRetrievals}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-2xl p-4 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by item, owner name, finder contact..."
            className="w-full glass-input rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-300">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Total Successful Retrievals: <strong className="text-white text-sm">{retrievals.length}</strong></span>
        </div>
      </div>

      {/* Retrievals List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading retrieved items archive...</div>
      ) : filteredRetrievals.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Retrieved Records Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            When potential matches are confirmed and items are physically collected by the owner, they are marked as retrieved and recorded here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRetrievals.map((match) => (
            <div
              key={match.id}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 hover:border-emerald-500/60 transition-all space-y-6 shadow-xl relative overflow-hidden"
            >
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-base">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-slate-500">Reunion Record #{match.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        RETRIEVED & RETURNED
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">{match.lost_item.name}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Match Accuracy</span>
                    <span className="text-xl font-black text-emerald-400">{Math.round(match.match_score)}%</span>
                  </div>

                  <button
                    onClick={() => setSelectedMatchForExplain(match)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors flex items-center space-x-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Explain Score</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side: Person Who Lost It vs Person Who Found It */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Person Who Lost It */}
                <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wider">
                      Original Owner (Lost Report)
                    </span>
                    <span className="text-[10px] text-slate-500">Item #{match.lost_item.id}</span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center space-x-2 text-white font-bold text-sm">
                      <User className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{match.lost_item.reporter_name}</span>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-blue-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{match.lost_item.reporter_contact}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>Lost at: <strong>{match.lost_item.location}</strong></span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>Reported Date: {match.lost_item.event_date}</span>
                    </div>

                    <p className="text-slate-400 pt-1 border-t border-red-950/40 text-[11px] leading-relaxed">
                      "{match.lost_item.description}"
                    </p>
                  </div>
                </div>

                {/* Person Who Found It */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                      Finder & Returner (Found Report)
                    </span>
                    <span className="text-[10px] text-slate-500">Item #{match.found_item.id}</span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center space-x-2 text-white font-bold text-sm">
                      <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{match.found_item.reporter_name}</span>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-blue-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{match.found_item.reporter_contact}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>Found at: <strong>{match.found_item.location}</strong></span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>Found Date: {match.found_item.event_date}</span>
                    </div>

                    <p className="text-slate-400 pt-1 border-t border-emerald-950/40 text-[11px] leading-relaxed">
                      "{match.found_item.description}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Retrieval Timestamp & Resolution Note */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Item verified and collected by rightful owner. Listing marked as completed.</span>
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  Retrieved on: {match.confirmed_at ? new Date(match.confirmed_at).toLocaleDateString() : 'Confirmed'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Score Explanation Modal */}
      {selectedMatchForExplain && (
        <ExplainModal
          match={selectedMatchForExplain}
          onClose={() => setSelectedMatchForExplain(null)}
        />
      )}
    </div>
  );
};
