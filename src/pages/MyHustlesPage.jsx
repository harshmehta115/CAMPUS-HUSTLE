import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, CheckCircle2, Star, IndianRupee,
  Plus, Eye, MessageSquare, Zap, Trash2, ArrowUpRight,
  ChevronDown, ChevronUp, X, Clock
} from 'lucide-react';
import { getCategoryInfo } from '../data/mockData';
import { useApp } from '../context/AppContext';

// ── Offers Modal ─────────────────────────────────────────────────
const OffersModal = ({ hustle, onClose }) => {
  const { offers, acceptOffer, addToast } = useApp();
  const [accepted, setAccepted] = useState(null);
  const relevant = offers.filter((o) => o.hustleId === hustle.id);

  const handleAccept = (offer) => {
    setAccepted(offer.id);
    acceptOffer(hustle.id, offer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="glass rounded-3xl w-full max-w-lg border border-white/12 shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h2 className="font-bold text-white text-base">Offers for your Hustle</h2>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">"{hustle.title}"</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {relevant.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 text-sm">No offers yet for this hustle.</p>
              <p className="text-gray-600 text-xs mt-1">Share it with classmates to get faster responses!</p>
            </div>
          ) : (
            relevant.map((offer) => {
              const isAccepted = accepted === offer.id;
              const anyAccepted = !!accepted;
              return (
                <div key={offer.id} className={`offer-card ${isAccepted ? 'border-green-500/40 bg-green-500/5' : anyAccepted ? 'opacity-40' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                      {offer.offerBy.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{offer.offerBy.name}</span>
                          <span className="flex items-center gap-0.5 text-xs text-gray-400">
                            <Star size={10} className="text-yellow-400" fill="currentColor" />
                            {offer.offerBy.rating}
                          </span>
                        </div>
                        <span className="text-green-400 font-bold text-sm">₹{offer.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{offer.offerBy.college} · {offer.postedAt}</p>
                      <p className="text-gray-300 text-xs leading-relaxed">{offer.message}</p>
                      <p className="text-blue-400 text-xs mt-2">⏱ {offer.deliveryTime}</p>
                      {isAccepted ? (
                        <div className="flex items-center gap-1.5 mt-3 text-green-400 text-xs font-semibold">
                          <CheckCircle2 size={13} /> Accepted!
                        </div>
                      ) : !anyAccepted ? (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleAccept(offer)} className="btn-primary text-xs px-3 py-1.5">✓ Accept</button>
                          <button onClick={() => addToast(`Opening chat with ${offer.offerBy.name}... (coming soon)`, 'info')} className="btn-secondary text-xs px-3 py-1.5">💬 Chat</button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/8">
          <button onClick={onClose} className="btn-secondary w-full justify-center py-2.5 text-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────────────
const DeleteConfirmModal = ({ hustle, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
    <div className="glass rounded-3xl w-full max-w-sm border border-white/12 shadow-2xl p-6 animate-slide-up text-center">
      <div className="text-4xl mb-4">🗑️</div>
      <h3 className="font-bold text-white text-lg mb-2">Delete Hustle?</h3>
      <p className="text-gray-400 text-sm mb-1">"{hustle.title}"</p>
      <p className="text-gray-600 text-xs mb-6">This will remove the posting from Campus Hustle. This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center py-2.5">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>Delete</button>
      </div>
    </div>
  </div>
);

// ── Progress Slider ───────────────────────────────────────────────
const ProgressSlider = ({ id, current, onUpdate }) => {
  const [val, setVal] = useState(current);
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500">Update progress</span>
        <span className="text-xs font-bold text-purple-400">{val}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-purple-500 mb-2"
      />
      <button
        onClick={() => onUpdate(id, val)}
        className="btn-primary text-xs px-4 py-1.5"
      >
        Save Progress
      </button>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────
const MyHustlesPage = () => {
  const navigate = useNavigate();
  const { myPosted, myActive, myCompleted, user, deletePosted, markComplete, updateProgress } = useApp();

  const [tab, setTab] = useState('active');
  const [offersModal, setOffersModal] = useState(null);     // hustle object
  const [deleteModal, setDeleteModal] = useState(null);     // hustle object
  const [expandedProgress, setExpandedProgress] = useState(null);

  const tabs = [
    { id: 'active', label: 'Active Hustles', count: myActive.length, icon: Zap, color: '#38bdf8' },
    { id: 'posted', label: 'My Posts', count: myPosted.length, icon: MessageSquare, color: '#a855f7' },
    { id: 'completed', label: 'Completed', count: myCompleted.length, icon: CheckCircle2, color: '#22c55e' },
  ];

  const handleDelete = (hustle) => {
    deletePosted(hustle.id);
    setDeleteModal(null);
  };

  const handleMarkComplete = (id) => {
    markComplete(id);
  };

  return (
    <div className="page-enter min-h-screen pt-20 pb-16">
      {/* Modals */}
      {offersModal && <OffersModal hustle={offersModal} onClose={() => setOffersModal(null)} />}
      {deleteModal && (
        <DeleteConfirmModal
          hustle={deleteModal}
          onConfirm={() => handleDelete(deleteModal)}
          onCancel={() => setDeleteModal(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">My Hustles</h1>
            <p className="text-gray-500 text-sm">Track your work, posts, and earnings</p>
          </div>
          <Link to="/post" className="btn-primary shrink-0">
            <Plus size={16} />
            New Hustle
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Earned', value: `₹${user.totalEarnings.toLocaleString()}`, icon: IndianRupee, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
            { label: 'Hustles Done', value: user.totalHustles, icon: CheckCircle2, color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
            { label: 'Completion Rate', value: `${user.completionRate}%`, icon: TrendingUp, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)' },
            { label: 'Avg. Rating', value: `${user.rating} ★`, icon: Star, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">{s.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                  <s.icon size={14} style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(({ id, label, count, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`tab-btn flex items-center gap-2 shrink-0 ${tab === id ? 'active' : ''}`}
            >
              <Icon size={14} style={tab === id ? { color } : {}} />
              {label}
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold transition-all ${tab === id ? 'text-white' : 'bg-white/8 text-gray-500'}`} style={tab === id ? { background: color } : {}}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── ACTIVE HUSTLES ── */}
        {tab === 'active' && (
          <div className="space-y-5 animate-fade-in">
            {myActive.length === 0 ? (
              <EmptyState
                emoji="⚡"
                msg="No active hustles"
                sub="Browse the explore page, find a hustle, and send your offer!"
                cta={{ label: 'Explore Hustles', to: '/explore' }}
              />
            ) : (
              myActive.map((h) => (
                <div key={h.id} className="card">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5 shrink-0">
                        {getCategoryInfo(h.category).icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base mb-0.5">{h.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="badge-blue text-xs">In Progress</span>
                          <span className="text-gray-500 text-xs">Client: <span className="text-gray-300">{h.client}</span></span>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Clock size={10} /> {h.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-green-400 font-black text-xl">
                        <IndianRupee size={15} />
                        {h.budget || h.earnings}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Progress</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-400">{h.progress}%</span>
                        <button
                          onClick={() => setExpandedProgress(expandedProgress === h.id ? null : h.id)}
                          className="text-gray-600 hover:text-purple-400 transition-colors"
                        >
                          {expandedProgress === h.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill transition-all duration-500" style={{ width: `${h.progress}%` }} />
                    </div>
                  </div>

                  {expandedProgress === h.id && (
                    <ProgressSlider
                      id={h.id}
                      current={h.progress}
                      onUpdate={(id, val) => { updateProgress(id, val); setExpandedProgress(null); }}
                    />
                  )}

                  <div className="flex items-center gap-3 mt-5 flex-wrap">
                    <button
                      onClick={() => handleMarkComplete(h.id)}
                      className="btn-primary text-xs py-2 px-4 gap-1.5"
                    >
                      <CheckCircle2 size={13} /> Mark Complete
                    </button>
                    <button
                      onClick={() => window.alert(`Chat with ${h.client} — real-time chat coming soon!`)}
                      className="btn-secondary text-xs py-2 px-4"
                    >
                      💬 Message Client
                    </button>
                    <button
                      onClick={() => navigate(`/hustle/${h.id}`)}
                      className="btn-ghost text-xs text-gray-500 gap-1"
                    >
                      <ArrowUpRight size={13} /> View Hustle
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── MY POSTS ── */}
        {tab === 'posted' && (
          <div className="space-y-5 animate-fade-in">
            {myPosted.length === 0 ? (
              <EmptyState
                emoji="📝"
                msg="You haven't posted any hustles yet"
                sub="Post a requirement and get offers from students on your campus!"
                cta={{ label: 'Post a Hustle', to: '/post' }}
              />
            ) : (
              myPosted.map((h) => (
                <div key={h.id} className="card">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5 shrink-0">
                        {getCategoryInfo(h.category).icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base mb-0.5">{h.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`badge text-xs ${h.status === 'completed' ? 'badge-orange' : h.status === 'active' ? 'badge-purple' : 'badge-green'}`}>
                            {h.status === 'completed' ? 'Completed' : h.status === 'active' ? 'In Progress' : 'Open'}
                          </span>
                          <span className="text-gray-500 text-xs">{h.postedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm shrink-0">
                      <div className="flex items-center gap-1 text-gray-500" title="Offers">
                        <MessageSquare size={13} />
                        <span className="font-bold text-white">{h.offers}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500" title="Views">
                        <Eye size={13} />
                        <span className="font-bold text-white">{h.views}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-white font-bold">
                      <IndianRupee size={13} className="text-green-400" />
                      <span>{h.budget.min}{h.budget.max && h.budget.max !== h.budget.min ? `–${h.budget.max}` : ''}</span>
                      {h.deadline !== 'No deadline' && (
                        <span className="text-gray-600 font-normal text-xs ml-2 flex items-center gap-1">
                          <Clock size={10} /> {h.deadline}
                        </span>
                      )}
                    </div>

                    {h.status === 'completed' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-400" />
                        <span className="text-xs text-gray-400">Completed with {h.completedWith || h.acceptedOffer?.offerBy?.name || 'a student'}</span>
                        {h.rating && (
                          <div className="flex">
                            {[...Array(h.rating)].map((_, i) => <Star key={i} size={11} className="text-yellow-400" fill="currentColor" />)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOffersModal(h)}
                          className="btn-primary text-xs py-2 px-4 gap-1.5"
                        >
                          <MessageSquare size={13} />
                          View Offers {h.offers > 0 && `(${h.offers})`}
                        </button>
                        <button
                          onClick={() => navigate(`/hustle/${h.id}`)}
                          className="btn-secondary text-xs py-2 px-4"
                        >
                          <ArrowUpRight size={13} /> View Post
                        </button>
                        <button
                          onClick={() => setDeleteModal(h)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete hustle"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── COMPLETED ── */}
        {tab === 'completed' && (
          <div className="space-y-5 animate-fade-in">
            {/* Earnings banner */}
            {myCompleted.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(168,85,247,0.08))', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total earnings from {myCompleted.length} completed hustle{myCompleted.length !== 1 ? 's' : ''}</p>
                    <p className="text-3xl font-black text-green-400">
                      ₹{myCompleted.reduce((s, h) => s + h.earnings, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xl font-black text-purple-400">{myCompleted.length}</p>
                      <p className="text-xs text-gray-500">Hustles</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-xl font-black text-yellow-400">
                        {myCompleted.length > 0
                          ? (myCompleted.reduce((s, h) => s + (h.rating || 0), 0) / myCompleted.length).toFixed(1)
                          : '—'} ★
                      </p>
                      <p className="text-xs text-gray-500">Avg Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {myCompleted.length === 0 ? (
              <EmptyState
                emoji="🏆"
                msg="No completed hustles yet"
                sub="Start working on your first hustle and earn from your skills!"
                cta={{ label: 'Browse Hustles', to: '/explore' }}
              />
            ) : (
              myCompleted.map((h) => (
                <div key={h.id} className="card">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5 shrink-0">
                        {getCategoryInfo(h.category).icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base mb-0.5">{h.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Client: <span className="text-gray-300">{h.client}</span></span>
                          <span>·</span>
                          <span>{h.completedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-green-400 font-black text-2xl">+₹{h.earnings}</p>
                      <span className="badge-green text-xs">Completed</span>
                    </div>
                  </div>

                  <div className="divider mb-4" />

                  {/* Review */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                      {h.clientAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className={s <= (h.rating || 0) ? 'text-yellow-400' : 'text-gray-700'} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">by {h.client}</span>
                      </div>
                      {h.review ? (
                        <p className="text-gray-300 text-sm italic">"{h.review}"</p>
                      ) : (
                        <p className="text-gray-600 text-xs italic">No review left yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────────
const EmptyState = ({ emoji, msg, sub, cta }) => (
  <div className="text-center py-20">
    <p className="text-5xl mb-4">{emoji}</p>
    <h3 className="text-xl font-bold text-white mb-2">{msg}</h3>
    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">{sub}</p>
    {cta && <Link to={cta.to} className="btn-primary">{cta.label}</Link>}
  </div>
);

export default MyHustlesPage;
