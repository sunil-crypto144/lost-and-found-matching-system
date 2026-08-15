import React, { useState } from 'react';
import { itemService } from '../services/api';
import { Match, Item } from '../types';
import { AlertCircle, Upload, CheckCircle2, Sparkles, User, Mail } from 'lucide-react';
import { MatchCard } from '../components/MatchCard';

const CATEGORIES = [
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

export const ReportLost: React.FC = () => {
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ item: Item; matches: Match[] } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG, and WEBP images are supported');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size cannot exceed 5MB');
        return;
      }
      setError('');
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reporterName.trim() || !reporterContact.trim() || !name.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in all required fields including your contact information');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('reporter_name', reporterName);
      formData.append('reporter_contact', reporterContact);
      formData.append('name', name);
      formData.append('category', category);
      if (brand) formData.append('brand', brand);
      if (color) formData.append('color', color);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('event_date', eventDate);
      if (eventTime) formData.append('event_time', eventTime);
      if (image) formData.append('image', image);

      const res = await itemService.createLostItem(formData);
      setSubmissionResult(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionResult) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
        <div className="glass-card rounded-2xl p-8 border border-emerald-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Lost Item Report Submitted Successfully!</h2>
          <p className="text-sm text-slate-300">
            Report ID <span className="font-mono text-blue-400">#{submissionResult.item.id}</span> registered for <span className="font-semibold text-white">{submissionResult.item.reporter_name}</span>.
          </p>
        </div>

        {/* Instant Matching Engine Results */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white">
              Instant Engine Match Results ({submissionResult.matches.length})
            </h3>
          </div>

          {submissionResult.matches.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-xs">
              No immediate high-confidence matches were found against current reported items. Our matching engine will continue monitoring new submissions.
            </div>
          ) : (
            <div className="space-y-6">
              {submissionResult.matches.map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          )}

          <div className="text-center pt-4">
            <button
              onClick={() => setSubmissionResult(null)}
              className="px-6 py-2.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-white text-xs transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="glass-card rounded-2xl p-8 border border-red-500/20 space-y-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            PUBLIC LOST ITEM REPORT
          </span>
          <h1 className="text-2xl font-extrabold text-white">Report a Lost Item</h1>
          <p className="text-xs text-slate-400">
            No registration required. Fill in your details below to run instant matching.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Details */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Reporter Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Alice Smith"
                    className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contact Email / Phone *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="alice@example.com or +1-555-0192"
                    className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Item Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Black Samsung Galaxy S23 Ultra"
              className="w-full glass-input rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input rounded-xl py-2.5 px-3 text-sm text-white bg-slate-900"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Samsung, Apple"
                className="w-full glass-input rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Primary Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Black, Silver"
                className="w-full glass-input rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Date Lost *</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full glass-input rounded-xl py-2.5 px-4 text-sm text-white bg-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Approximate Time Lost</label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full glass-input rounded-xl py-2.5 px-4 text-sm text-white bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Location Lost *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Central Park Library 2nd Floor"
              className="w-full glass-input rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Detailed Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe distinguishing marks, protective case, contents, stickers, or serial numbers..."
              className="w-full glass-input rounded-xl p-3 text-sm text-white placeholder-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Item Image (Optional)</label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-2 transition-colors">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Choose Image File</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
              </label>

              {previewUrl && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-red-600/20"
          >
            <span>{submitting ? 'Submitting & Matching...' : 'Submit Lost Item Request'}</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
