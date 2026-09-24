import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, Clock, Eye, MessageSquare, Star, IndianRupee,
  Share2, Bookmark, CheckCircle2, Send, ChevronDown, ChevronUp,
  User, X
} from 'lucide-react';
import { getCategoryInfo } from '../data/mockData';
import { useApp } from '../context/AppContext';

const HustleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hustles, offers, acceptOffer, sendOffer, addToast } = useApp();

  const hustle = hustles.find((h) => h.id === Number(id));
  const relevantOffers = offers.filter((o) => o.hustleId === hustle?.id);

  const [offerExpanded, setOfferExpanded] = useState(false);
  const [myOffer, setMyOffer] = useState('');
  const [myPrice, setMyPrice] = useState('');
  const [offerSent, setOfferSent] = useState(false);
  const [acceptedOfferId, setAcceptedOfferId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [formError, setFormError] = useState('');

  if (!hustle) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold text-white mb-2">Hustle not found</h2>
          <p className="text-gray-500 text-sm mb-6">It may have been removed or completed.</p>
          <button onClick={() => navigate('/explore')} className="btn-primary">
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const cat = getCategoryInfo(hustle.category);

  const handleSendOffer = () => {
    if (!myPrice) { setFormError('Please enter your price.'); return; }
    if (!myOffer.trim() || myOffer.trim().length < 20) { setFormError('Write at least 20 characters explaining why you\'re the right fit.'); return; }
    setFormError('');
    sendOffer(hustle.id, myPrice, myOffer);
    setOfferSent(true);
  };

  const handleAcceptOffer = (offer) => {
    setAcceptedOfferId(offer.id);
    acceptOffer(hustle.id, offer);
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
    addToast(saved ? 'Removed from saved.' : 'Hustle saved! 🔖', 'info');
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => addToast('Link copied to clipboard! 🔗'));
    }
    setShowShareModal(false);
  };

  const visibleOffers = offerExpanded ? relevantOffers : relevantOffers.slice(0, 2);

  return (
    <div className="page-enter min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main card */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white/8 border border-white/10">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{cat.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge text-xs uppercase font-bold ${hustle.status === 'open' ? 'badge-green' : hustle.status === 'active' ? 'badge-purple' : 'badge-orange'}`}>
                        {hustle.status}
                      </span>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-500 text-xs">{hustle.postedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    title={saved ? 'Remove bookmark' : 'Save hustle'}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${saved ? 'text-purple-400 bg-purple-500/15 border border-purple-500/30' : 'text-gray-500 hover:text-white bg-white/5'}`}
                  >
                    <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleShare}
                    title="Copy link"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-white bg-white/5 transition-all"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl font-black text-white mb-4 leading-snug">{hustle.title}</h1>
              <p className="text-gray-400 leading-relaxed text-sm mb-6">{hustle.description}</p>

              {/* Tags */}
              {hustle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {hustle.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
                      className="tag-pill hover:border-purple-500/40 hover:text-purple-300 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="stat-card text-center">
                  <IndianRupee className="w-4 h-4 text-green-400 mx-auto mb-2" />
                  <p className="font-bold text-white text-lg">
                    {hustle.budget.min === hustle.budget.max
                      ? hustle.budget.min
                      : `${hustle.budget.min}–${hustle.budget.max}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Budget (₹)</p>
                </div>
                <div className="stat-card text-center">
                  <Clock className="w-4 h-4 text-blue-400 mx-auto mb-2" />
                  <p className="font-bold text-white text-sm">{hustle.deadline}</p>
                  <p className="text-xs text-gray-500 mt-1">Deadline</p>
                </div>
                <div className="stat-card text-center">
                  <MessageSquare className="w-4 h-4 text-purple-400 mx-auto mb-2" />
                  <p className="font-bold text-white text-lg">{hustle.offers}</p>
                  <p className="text-xs text-gray-500 mt-1">Offers</p>
                </div>
              </div>
            </div>

            {/* ── Offers ── */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white text-lg">
                  Offers <span className="text-gray-500 font-normal text-base">({relevantOffers.length})</span>
                </h2>
                {relevantOffers.length > 2 && (
                  <button
                    onClick={() => setOfferExpanded(!offerExpanded)}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    {offerExpanded ? <><ChevronUp size={13} /> Collapse</> : <><ChevronDown size={13} /> View all {relevantOffers.length}</>}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {relevantOffers.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-3xl mb-3">📬</p>
                    <p className="text-sm text-gray-500 mb-1">No offers yet</p>
                    <p className="text-xs text-gray-600">Be the first to offer your help below!</p>
                  </div>
                ) : (
                  visibleOffers.map((offer) => {
                    const isAccepted = acceptedOfferId === offer.id;
                    const anyAccepted = !!acceptedOfferId;
                    return (
                      <div
                        key={offer.id}
                        className={`offer-card transition-all ${isAccepted ? 'border-green-500/40 bg-green-500/5' : anyAccepted ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                            {offer.offerBy.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white">{offer.offerBy.name}</span>
                                <div className="flex items-center gap-0.5">
                                  <Star size={11} className="text-yellow-400" fill="currentColor" />
                                  <span className="text-xs text-gray-400">{offer.offerBy.rating}</span>
                                  <span className="text-gray-600 text-xs ml-1">({offer.offerBy.reviews})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-green-400">
                                <IndianRupee size={13} />
                                <span className="font-bold text-sm">{offer.price}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">{offer.offerBy.college} · {offer.postedAt}</p>
                            <p className="text-gray-300 text-sm mt-3 leading-relaxed">{offer.message}</p>
                            <p className="text-xs text-blue-400 mt-2">⏱ {offer.deliveryTime}</p>

                            {isAccepted ? (
                              <div className="flex items-center gap-2 mt-4 text-green-400 text-sm font-semibold">
                                <CheckCircle2 size={16} />
                                Offer Accepted! Check My Hustles for updates.
                              </div>
                            ) : !anyAccepted ? (
                              <div className="flex items-center gap-2 mt-4">
                                <button
                                  onClick={() => handleAcceptOffer(offer)}
                                  className="btn-primary text-xs px-4 py-2"
                                >
                                  ✓ Accept Offer
                                </button>
                                <button
                                  onClick={() => addToast(`Opening chat with ${offer.offerBy.name}... (coming soon)`, 'info')}
                                  className="btn-secondary text-xs px-4 py-2"
                                >
                                  💬 Message
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── Make an Offer ── */}
            <div className="card">
              <h2 className="font-bold text-white text-lg mb-1">Make an Offer</h2>
              <p className="text-gray-500 text-xs mb-6">Pitch your services to the poster. Be clear, confident, and competitive.</p>

              {offerSent ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white text-xl mb-2">Offer Sent! 🎉</h3>
                  <p className="text-gray-500 text-sm mb-6">The poster will review your offer. You'll get a notification if accepted.</p>
                  <button
                    onClick={() => { setOfferSent(false); setMyOffer(''); setMyPrice(''); }}
                    className="btn-ghost text-xs text-gray-500"
                  >
                    Send another offer
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">
                      Your Price (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={myPrice}
                      onChange={(e) => { setMyPrice(e.target.value); setFormError(''); }}
                      placeholder={`Budget: ₹${hustle.budget.min}${hustle.budget.max !== hustle.budget.min ? `–₹${hustle.budget.max}` : ''}`}
                      className="input-field"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">
                      Your Pitch <span className="text-red-400">*</span>
                      <span className="text-gray-600 font-normal ml-1">(min 20 chars)</span>
                    </label>
                    <textarea
                      value={myOffer}
                      onChange={(e) => { setMyOffer(e.target.value); setFormError(''); }}
                      placeholder="Tell them about your experience, why you're the right fit, and how you'll approach this..."
                      rows={4}
                      className="input-field resize-none"
                    />
                    <p className="text-xs text-gray-600 mt-1 text-right">{myOffer.length} chars</p>
                  </div>
                  {formError && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <X size={12} /> {formError}
                    </p>
                  )}
                  <button
                    onClick={handleSendOffer}
                    className="btn-primary w-full justify-center py-3"
                  >
                    <Send size={16} />
                    Send Offer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-5">
            {/* Poster */}
            <div className="card">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Posted by</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-purple-500/30" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)' }}>
                  {hustle.poster.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{hustle.poster.name}</p>
                  <p className="text-xs text-gray-500">{hustle.poster.college}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="stat-card text-center py-3">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star size={12} className="text-yellow-400" fill="currentColor" />
                    <span className="font-bold text-white text-sm">{hustle.poster.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="stat-card text-center py-3">
                  <p className="font-bold text-white text-sm mb-1">{hustle.poster.reviews}</p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/profile')}
                className="btn-secondary w-full justify-center py-2.5 text-sm gap-2"
              >
                <User size={14} /> View Profile
              </button>
            </div>

            {/* Activity */}
            <div className="card">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Activity</h3>
              <div className="space-y-3">
                {[
                  { label: 'Views', value: hustle.views, icon: '👁️' },
                  { label: 'Offers received', value: hustle.offers, icon: '📬' },
                  { label: 'Posted', value: hustle.postedAt, icon: '📅' },
                  { label: 'Deadline', value: hustle.deadline, icon: '⏰' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span>{icon}</span> {label}
                    </span>
                    <span className={`text-xs font-semibold ${label === 'Deadline' ? 'text-orange-400' : 'text-white'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related */}
            <div className="card">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Similar Hustles</h3>
              <div className="space-y-3">
                {hustles
                  .filter((h) => h.id !== hustle.id && h.category === hustle.category)
                  .slice(0, 3)
                  .map((h) => (
                    <button
                      key={h.id}
                      onClick={() => navigate(`/hustle/${h.id}`)}
                      className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/8 hover:border-purple-500/30 transition-all group"
                    >
                      <p className="text-xs font-medium text-white group-hover:text-purple-200 transition-colors line-clamp-1">{h.title}</p>
                      <p className="text-xs text-green-400 mt-1">₹{h.budget.min}–{h.budget.max}</p>
                    </button>
                  ))}
                {hustles.filter((h) => h.id !== hustle.id && h.category === hustle.category).length === 0 && (
                  <button
                    onClick={() => navigate('/explore')}
                    className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/8 hover:border-purple-500/30 transition-all"
                  >
                    <p className="text-xs text-gray-500">Browse all hustles →</p>
                  </button>
                )}
              </div>
            </div>

            {/* Safety */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <p className="text-xs font-semibold text-purple-400 mb-2">🛡️ Campus Safety Tips</p>
              <ul className="text-xs text-gray-500 space-y-1.5">
                <li>• Meet in public campus areas</li>
                <li>• Verify student ID before payment</li>
                <li>• Pay only after delivery</li>
                <li>• Report suspicious activity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HustleDetailPage;
