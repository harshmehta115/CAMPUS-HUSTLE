import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star, Edit3, Share2, MapPin, Calendar, Zap, CheckCircle2,
  TrendingUp, Clock, ExternalLink, Save, X, Plus, Trash2,
  Wallet, ArrowDownToLine, AlertCircle
} from "lucide-react";
import { getCategoryInfo } from "../data/mockData";
import { useApp } from "../context/AppContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, myCompleted, updateBio, updateSkills, addToast, requestWithdrawal } = useApp();

  const [tab, setTab] = useState("about");
  const [editing, setEditing] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(user.skills);
  const [editingSkills, setEditingSkills] = useState(false);

  // Withdrawal state
  const [upiId, setUpiId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleSaveBio = () => {
    if (!bioInput.trim()) { addToast("Bio cannot be empty.", "error"); return; }
    updateBio(bioInput.trim());
    setEditing(false);
  };

  const handleCancelBio = () => { setBioInput(user.bio); setEditing(false); };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (skills.includes(s)) { addToast("Skill already added.", "info"); return; }
    const updated = [...skills, s];
    setSkills(updated);
    updateSkills(updated);
    setSkillInput("");
    addToast('"' + s + '" skill added!');
  };

  const removeSkill = (skill) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    updateSkills(updated);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => addToast("Profile link copied!"));
    }
  };

  const handleWithdraw = () => {
    setWithdrawError("");
    const amount = Number(withdrawAmount);
    if (!upiId.trim() || !upiId.includes("@")) { setWithdrawError("Enter a valid UPI ID (e.g. name@upi)."); return; }
    if (!amount || amount < 100) { setWithdrawError("Minimum withdrawal is 100 Hustle Coins."); return; }
    if (amount > (user.hustleCoins || 0)) { setWithdrawError("Insufficient Hustle Coins balance."); return; }
    const success = requestWithdrawal(upiId.trim(), amount);
    if (success) { setWithdrawSuccess(true); setUpiId(""); setWithdrawAmount(""); }
  };

  const totalEarnings = myCompleted.reduce((s, h) => s + h.earnings, 0);
  const avgRating = myCompleted.length > 0
    ? (myCompleted.reduce((s, h) => s + (h.rating || 0), 0) / myCompleted.length).toFixed(1)
    : user.rating;

  const coins = user.hustleCoins !== undefined ? user.hustleCoins : user.totalEarnings;
  const withdrawHistory = user.withdrawalHistory || [];

  return (
    <div className="page-enter min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner + Profile Header */}
        <div className="relative rounded-3xl overflow-hidden mb-6">
          <div className="h-36 lg:h-44 relative overflow-hidden" style={{
            background: "linear-gradient(135deg, #1a0533 0%, #0a0f2e 50%, #051027 100%)",
          }}>
            <div className="blob blob-purple w-56 h-56 top-0 left-1/4 opacity-30" />
            <div className="blob blob-blue w-48 h-48 top-0 right-1/4 opacity-25" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          </div>

          <div className="px-6 pb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", borderRadius: "0 0 24px 24px" }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 sm:-mt-12 mb-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-2xl font-black text-white ring-4 ring-navy-950 shrink-0 z-10 select-none"
                style={{ background: "linear-gradient(135deg, #9333ea, #3b82f6)" }}>
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0 sm:pb-1">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h1 className="text-xl font-black text-white">{user.name}</h1>
                      <CheckCircle2 size={16} className="text-blue-400 shrink-0" fill="currentColor" />
                      <span className="badge-purple text-xs">Student</span>
                    </div>
                    <p className="text-gray-400 text-sm">{user.year}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={handleShare} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all hover:border-white/20" title="Share profile">
                      <Share2 size={15} />
                    </button>
                    <button onClick={() => { setEditing(!editing); setBioInput(user.bio); }} className="btn-secondary text-xs px-4 py-2 gap-1.5">
                      <Edit3 size={13} /> {editing ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-500 text-xs">
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {user.college}</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} /> Joined {user.joinedAt}</span>
              <span className="flex items-center gap-1.5 text-yellow-400">
                <Star size={12} fill="currentColor" />
                <span className="font-bold">{avgRating}</span>
                <span className="text-gray-600">({user.reviews} reviews)</span>
              </span>
              <span className="flex items-center gap-1.5 text-yellow-400">
                <span>🪙</span>
                <span className="font-bold">{coins.toLocaleString()} Hustle Coins</span>
              </span>
            </div>

            {editing ? (
              <div className="mb-4 space-y-3">
                <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} className="input-field resize-none text-sm" rows={3} placeholder="Write a short bio..." autoFocus maxLength={200} />
                <p className="text-xs text-gray-600 text-right">{bioInput.length}/200</p>
                <div className="flex gap-2">
                  <button onClick={handleSaveBio} className="btn-primary text-xs px-5 py-2 gap-1.5"><Save size={13} /> Save Changes</button>
                  <button onClick={handleCancelBio} className="btn-secondary text-xs px-5 py-2">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{user.bio}</p>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 font-medium">Skills</span>
                <button onClick={() => setEditingSkills(!editingSkills)} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  {editingSkills ? "Done" : "+ Edit"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-1">
                    <span className="badge-purple text-xs">{skill}</span>
                    {editingSkills && (
                      <button onClick={() => removeSkill(skill)} className="text-gray-600 hover:text-red-400 transition-colors ml-0.5">
                        <X size={11} />
                      </button>
                    )}
                  </div>
                ))}
                {editingSkills && (
                  <div className="flex items-center gap-2">
                    <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} placeholder="Add skill..." className="input-field text-xs py-1.5 px-3 w-32" />
                    <button onClick={addSkill} className="btn-primary text-xs py-1.5 px-3"><Plus size={12} /> Add</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Hustle Coins", value: coins.toLocaleString() + " 🪙", color: "#eab308", icon: Wallet },
            { label: "Hustles Done", value: user.totalHustles, color: "#a855f7", icon: Zap },
            { label: "Completion Rate", value: user.completionRate + "%", color: "#38bdf8", icon: TrendingUp },
            { label: "Response Time", value: user.responseTime, color: "#f59e0b", icon: Clock },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={13} style={{ color: s.color }} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {[
            { id: "about", label: "👤 About" },
            { id: "portfolio", label: "💼 Portfolio" },
            { id: "reviews", label: "⭐ Reviews" },
            { id: "coins", label: "🪙 Coins & Withdraw" },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)} className={"tab-btn shrink-0 " + (tab === id ? "active" : "")}>{label}</button>
          ))}
        </div>

        {/* ABOUT TAB */}
        {tab === "about" && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
            <div className="card">
              <h3 className="font-bold text-white text-sm mb-4">Skills & Expertise</h3>
              <div className="space-y-4">
                {[
                  { skill: "Graphic Design", level: 90 },
                  { skill: "Video Editing", level: 80 },
                  { skill: "Python", level: 70 },
                  { skill: "Web Development", level: 75 },
                  { skill: "Tutoring", level: 85 },
                ].map(({ skill, level }) => (
                  <div key={skill}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-300 font-medium">{skill}</span>
                      <span className="text-xs text-gray-600">{level}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: level + "%" }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-white text-sm mb-4">Quick Info</h3>
              <div className="space-y-4">
                <InfoRow label="College" value={user.college} />
                <InfoRow label="Year / Course" value={user.year} />
                <InfoRow label="Member since" value={user.joinedAt} />
                <div className="divider" />
                <div>
                  <p className="text-xs text-gray-500 mb-2">Social Links</p>
                  {Object.entries(user.social).map(([platform, handle]) => (
                    <div key={platform} className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-500 capitalize w-16">{platform}</span>
                      <button onClick={() => addToast("Opening " + platform + "... (demo mode)", "info")}
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                        {handle} <ExternalLink size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card lg:col-span-2">
              <h3 className="font-bold text-white text-sm mb-4">🏆 Achievements</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: "⚡", title: "Fast Hustler", desc: "Responds in < 1hr", earned: true },
                  { icon: "🌟", title: "Top Rated", desc: "4.8+ rating", earned: user.rating >= 4.8 },
                  { icon: "💰", title: "First Earn", desc: "First paid hustle", earned: user.totalHustles >= 1 },
                  { icon: "🔥", title: "10x Hustler", desc: "10 completed", earned: user.totalHustles >= 10 },
                  { icon: "🎯", title: "Perfect Score", desc: "5 star three times", earned: myCompleted.filter(h => h.rating === 5).length >= 3 },
                  { icon: "👑", title: "Campus Pro", desc: "50+ hustles", earned: user.totalHustles >= 50 },
                  { icon: "💎", title: "Elite Hustler", desc: "8000+ coins", earned: coins >= 8000 },
                  { icon: "🚀", title: "Trending", desc: "Featured hustle", earned: false },
                ].map((a) => (
                  <div key={a.title} className={"rounded-xl p-3 text-center transition-all " + (a.earned ? "" : "opacity-30 grayscale")}
                    style={{ background: a.earned ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)", border: a.earned ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="text-2xl mb-1.5">{a.icon}</div>
                    <p className="text-xs font-bold text-white mb-0.5">{a.title}</p>
                    <p className="text-xs text-gray-600">{a.desc}</p>
                    {a.earned && <CheckCircle2 size={11} className="text-green-400 mx-auto mt-1.5" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {tab === "portfolio" && (
          <div className="animate-fade-in">
            <p className="text-gray-500 text-sm mb-5">
              {myCompleted.length} completed hustles — {myCompleted.length === 0 ? "Complete your first hustle to build your portfolio!" : "Showcasing your track record."}
            </p>
            {myCompleted.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">💼</p>
                <h3 className="text-xl font-bold text-white mb-2">Portfolio is empty</h3>
                <p className="text-gray-500 text-sm mb-6">Complete hustles to showcase your work here.</p>
                <button onClick={() => navigate("/explore")} className="btn-primary">Find Hustles</button>
              </div>
            ) : (
              <div className="space-y-4">
                {myCompleted.map((h) => (
                  <div key={h.id} className="card flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5 shrink-0">{getCategoryInfo(h.category).icon}</div>
                      <div>
                        <h3 className="font-semibold text-white text-sm mb-1">{h.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Client: {h.client}</span><span>·</span><span>{h.completedAt}</span>
                        </div>
                        <div className="flex mt-1.5">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} size={11} className={i <= (h.rating || 0) ? "text-yellow-400" : "text-gray-700"} fill="currentColor" />
                          ))}
                          {h.review && <span className="text-xs text-gray-500 ml-2 italic">"{h.review.slice(0, 40)}..."</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-yellow-400 font-black text-xl">+{h.earnings} 🪙</p>
                      <span className="badge-green text-xs">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === "reviews" && (
          <div className="animate-fade-in">
            {myCompleted.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">⭐</p>
                <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
                <p className="text-gray-500 text-sm mb-6">Complete your first hustle to earn your first review!</p>
                <button onClick={() => navigate("/explore")} className="btn-primary">Find Hustles</button>
              </div>
            ) : (
              <>
                <div className="card mb-6">
                  <div className="flex items-center gap-8 flex-wrap">
                    <div className="text-center">
                      <p className="text-5xl font-black gradient-text">{avgRating}</p>
                      <div className="flex justify-center gap-0.5 my-2">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={16} className={s <= Math.round(Number(avgRating)) ? "text-yellow-400" : "text-gray-700"} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs">{myCompleted.length} review{myCompleted.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex-1 min-w-48 space-y-2">
                      {[5,4,3,2,1].map((star) => {
                        const count = myCompleted.filter(h => h.rating === star).length;
                        const pct = myCompleted.length > 0 ? (count / myCompleted.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-6">{star}★</span>
                            <div className="progress-bar flex-1"><div className="progress-fill transition-all duration-700" style={{ width: pct + "%" }} /></div>
                            <span className="text-xs text-gray-600 w-3">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {myCompleted.map((h) => (
                    <div key={h.id} className="card">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg, #9333ea, #3b82f6)" }}>{h.clientAvatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-white">{h.client}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map((s) => (
                                  <Star key={s} size={11} className={s <= (h.rating || 0) ? "text-yellow-400" : "text-gray-700"} fill="currentColor" />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-gray-600">{h.completedAt}</span>
                          </div>
                          <p className="text-xs text-purple-400 mb-2 font-medium">For: {h.title}</p>
                          {h.review ? <p className="text-gray-300 text-sm italic">"{h.review}"</p> : <p className="text-gray-600 text-xs italic">No written review left.</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* COINS & WITHDRAW TAB */}
        {tab === "coins" && (
          <div className="animate-fade-in space-y-6">
            {/* Balance Card */}
            <div className="card relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.12), rgba(168,85,247,0.08))", border: "1px solid rgba(234,179,8,0.25)" }}>
              <div className="blob blob-purple w-40 h-40 top-0 right-0 opacity-10" />
              <div className="relative z-10">
                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">Your Hustle Coins Balance</p>
                <p className="text-5xl font-black text-yellow-400 mb-1">{coins.toLocaleString()}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <span>🪙</span> Earn coins by completing hustles. Withdraw anytime via UPI.
                </p>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "rgba(234,179,8,0.07)", border: "1px solid rgba(234,179,8,0.2)" }}>
              <AlertCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-400 mb-0.5">Demo / Simulated Feature</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This is a simulated withdrawal system for demo purposes. No real money transfers occur. Withdrawal requests are logged and shown as "Processed at month-end". This feature is presented transparently as part of the ITBM Campus Hustle MVP.
                </p>
              </div>
            </div>

            {/* Withdraw Form */}
            <div className="card">
              <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                <ArrowDownToLine size={16} className="text-yellow-400" /> Withdraw Coins
              </h3>
              <p className="text-xs text-gray-500 mb-5">Enter your UPI ID and coin amount to request a withdrawal. Minimum: 100 coins.</p>

              {withdrawSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white text-lg mb-2">Withdrawal Requested!</h3>
                  <p className="text-gray-400 text-sm mb-1">Your request has been submitted.</p>
                  <p className="text-xs text-gray-600 mb-6">Withdrawal requested — processed at month-end.</p>
                  <button onClick={() => setWithdrawSuccess(false)} className="btn-secondary text-xs px-6 py-2">New Request</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">UPI ID <span className="text-red-400">*</span></label>
                    <input type="text" value={upiId} onChange={(e) => { setUpiId(e.target.value); setWithdrawError(""); }}
                      placeholder="yourname@upi" className={"input-field " + (withdrawError && withdrawError.includes("UPI") ? "border-red-500/60" : "")} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">
                      Amount (Coins) <span className="text-red-400">*</span>
                      <span className="text-gray-600 font-normal ml-1">Available: {coins.toLocaleString()} 🪙</span>
                    </label>
                    <input type="number" value={withdrawAmount} onChange={(e) => { setWithdrawAmount(e.target.value); setWithdrawError(""); }}
                      placeholder="Min. 100 coins" min={100} max={coins}
                      className={"input-field " + (withdrawError && withdrawError.includes("coin") ? "border-red-500/60" : "")} />
                  </div>
                  {withdrawError && (
                    <p className="text-red-400 text-xs flex items-center gap-1"><X size={12} /> {withdrawError}</p>
                  )}
                  <button onClick={handleWithdraw} className="btn-primary w-full justify-center py-3">
                    <ArrowDownToLine size={16} /> Request Withdrawal
                  </button>
                </div>
              )}
            </div>

            {/* Withdrawal History */}
            <div className="card">
              <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                <Wallet size={15} className="text-gray-400" /> Withdrawal History
              </h3>
              {withdrawHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-3">📋</p>
                  <p className="text-gray-600 text-sm">No withdrawal requests yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {withdrawHistory.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div>
                        <p className="text-sm font-semibold text-white">{w.upiId}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{w.requestedAt} · Processed at month-end</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold text-base">{w.amount} 🪙</p>
                        <span className="badge-orange text-xs mt-1">Pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm text-white font-medium">{value}</p>
  </div>
);

export default ProfilePage;