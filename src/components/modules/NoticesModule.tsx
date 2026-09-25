import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Megaphone,
  Pin,
  PlusCircle,
  Calendar,
  User,
  Trash2,
  X,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Announcement } from '../../types';

export const NoticesModule: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, currentUser } = useSchool();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('academic');
  const [targetAudience, setTargetAudience] = useState<Announcement['targetAudience']>('all');
  const [isPinned, setIsPinned] = useState(false);

  const canPost = currentUser.role === 'admin' || currentUser.role === 'teacher';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      title,
      content,
      category,
      targetAudience,
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name,
      isPinned,
    });

    setTitle('');
    setContent('');
    setIsPinned(false);
    setIsAddModalOpen(false);
  };

  const filteredNotices = announcements.filter(a => {
    if (categoryFilter === 'all') return true;
    return a.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            School Announcements & Circulars
          </h2>
          <p className="text-xs text-slate-500">
            Broadcast official examination alerts, fee notices, academic schedules and school events
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter by Category:</span>
          {['all', 'examination', 'fees', 'academic', 'event', 'urgent'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs rounded-md capitalize font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredNotices.length} notices
        </span>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.map((ann) => (
          <div
            key={ann.id}
            className={`rounded-xl border p-5 shadow-2xs flex flex-col justify-between transition-all ${
              ann.isPinned
                ? 'border-indigo-200 bg-indigo-50/20'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    ann.category === 'examination' ? 'bg-purple-50 text-purple-700' :
                    ann.category === 'fees' ? 'bg-rose-50 text-rose-700' :
                    ann.category === 'academic' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {ann.category}
                  </span>

                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700">
                      <Pin className="w-3 h-3 fill-indigo-600" />
                      <span>Pinned Notice</span>
                    </span>
                  )}
                </div>

                {canPost && (
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this announcement?')) {
                        deleteAnnouncement(ann.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {ann.title}
              </h3>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium text-slate-600">Issued by: {ann.author}</span>
              <span className="font-mono">{ann.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Announcement Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Publish School Announcement
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for 2nd Term Mock & Practical Examinations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="academic">Academic</option>
                    <option value="examination">Examination</option>
                    <option value="fees">Fees & Bursary</option>
                    <option value="event">School Event</option>
                    <option value="urgent">Urgent Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="all">Entire School Community</option>
                    <option value="students">Students Only</option>
                    <option value="parents">Parents / Guardians</option>
                    <option value="teachers">Teaching Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Notice Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter complete circular text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600"
                />
                <label htmlFor="pinNotice" className="text-slate-700 font-medium">
                  Pin to top of notice board for high visibility
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
