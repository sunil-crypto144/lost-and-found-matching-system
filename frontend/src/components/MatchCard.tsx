import React, { useState } from 'react';
import { Match } from '../types';
import { Sparkles, CheckCircle2, XCircle, Info, MapPin, Calendar, Tag, Check, Award } from 'lucide-react';
import { ExplainModal } from './ExplainModal';

interface MatchCardProps {
  match: Match;
  onConfirm?: (id: number) => void;
  onResolve?: (id: number) => void;
  onReject?: (id: number) => void;
  currentUserId?: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onConfirm, onResolve, onReject, currentUserId }) => {
  const [showExplain, setShowExplain] = useState(false);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong Match';
    if (score >= 60) return 'Possible Match';
    return 'Weak Match';
  };

  const isAccepted = match.status === 'ACCEPTED';
  const isResolved = match.status === 'RESOLVED';
  const isRejected = match.status === 'REJECTED';

  return (
    <>
      <div className="glass-card rounded-2xl p-6 hover:border-slate-700 transition-all space-y-6">
        {/* Match Score Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-lg text-white shadow-lg shadow-blue-500/20">
              {Math.round(match.match_score)}%
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getScoreBadgeColor(match.match_score)}`}>
                {getScoreLabel(match.match_score)}
              </span>
              <p className="text-xs text-slate-400 mt-1">Match ID #{match.id}</p>
            </div>
          </div>

          <button
            onClick={() => setShowExplain(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Info className="w-4 h-4 text-blue-400" />
            <span>Explain Score</span>
          </button>
        </div>

        {/* Comparison Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lost Item */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 tracking-wider uppercase">LOST ITEM</span>
              <span className="text-xs text-slate-400">Reporter: {match.lost_item.reporter_name}</span>
            </div>
            <h4 className="font-bold text-white line-clamp-1">{match.lost_item.name}</h4>
            <p className="text-xs text-slate-400 line-clamp-2">{match.lost_item.description}</p>
            <div className="text-xs text-slate-300 space-y-1 pt-1">
              <div className="flex items-center space-x-1.5">
                <Tag className="w-3 h-3 text-red-400" />
                <span>{match.lost_item.category} ({match.lost_item.color || 'N/A'})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3 h-3 text-red-400" />
                <span className="truncate">{match.lost_item.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3 h-3 text-red-400" />
                <span>{match.lost_item.event_date}</span>
              </div>
            </div>
          </div>

          {/* Found Item */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">FOUND ITEM</span>
              <span className="text-xs text-slate-400">Reporter: {match.found_item.reporter_name}</span>
            </div>
            <h4 className="font-bold text-white line-clamp-1">{match.found_item.name}</h4>
            <p className="text-xs text-slate-400 line-clamp-2">{match.found_item.description}</p>
            <div className="text-xs text-slate-300 space-y-1 pt-1">
              <div className="flex items-center space-x-1.5">
                <Tag className="w-3 h-3 text-emerald-400" />
                <span>{match.found_item.category} ({match.found_item.color || 'N/A'})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="truncate">{match.found_item.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>{match.found_item.event_date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Match Reasons */}
        {match.reasons && match.reasons.length > 0 && (
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-xs">
            <span className="font-semibold text-slate-300 block mb-1">Key Matching Reasons:</span>
            <div className="flex flex-wrap gap-1.5">
              {match.reasons.map((r, idx) => (
                <span key={idx} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  • {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              match.status === 'SUGGESTED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              match.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              match.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {match.status === 'RESOLVED' ? '✓ COLLECTED & RETRIEVED' : `STATUS: ${match.status}`}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {match.status === 'SUGGESTED' && (
              <>
                {onReject && (
                  <button
                    onClick={() => onReject(match.id)}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                )}

                {onConfirm && (
                  <button
                    onClick={() => onConfirm(match.id)}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Match</span>
                  </button>
                )}
              </>
            )}

            {isAccepted && onResolve && (
              <button
                onClick={() => onResolve(match.id)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Mark as Collected & Retrieved</span>
              </button>
            )}

            {isResolved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Moved to Retrieved Archive</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {showExplain && (
        <ExplainModal match={match} onClose={() => setShowExplain(false)} />
      )}
    </>
  );
};
