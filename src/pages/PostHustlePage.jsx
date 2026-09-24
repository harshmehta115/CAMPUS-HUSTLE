import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Info, Zap, X } from 'lucide-react';
import { categories } from '../data/mockData';
import { useApp } from '../context/AppContext';

const PostHustlePage = () => {
  const navigate = useNavigate();
  const { postHustle } = useApp();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedForm, setSubmittedForm] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
    tags: '',
    contactPref: 'offers',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.title.trim() || form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters.';
    if (form.title.trim().length > 100) errs.title = 'Title must be under 100 characters.';
    if (!form.category) errs.category = 'Please select a category.';
    if (!form.description.trim() || form.description.trim().length < 30) errs.description = 'Description must be at least 30 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.budgetMin || isNaN(Number(form.budgetMin)) || Number(form.budgetMin) < 1) errs.budgetMin = 'Enter a valid minimum budget (at least ₹1).';
    if (form.budgetMax && Number(form.budgetMax) < Number(form.budgetMin)) errs.budgetMax = 'Max budget must be ≥ min budget.';
    if (!form.deadline) errs.deadline = 'Please select a deadline.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => {
    postHustle(form);
    setSubmittedForm(form);
    setSubmitted(true);
  };

  const selectedCat = categories.find((c) => c.id === form.category);

  if (submitted && submittedForm) {
    return (
      <div className="page-enter min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6)', boxShadow: '0 0 40px rgba(147,51,234,0.4)' }}>
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Hustle Posted! 🚀</h2>
          <p className="text-gray-400 text-base mb-1">
            <span className="gradient-text font-semibold">"{submittedForm.title}"</span> is now live.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Students on your campus will start sending offers. Check <strong className="text-white">My Hustles → My Posts</strong> to manage it.
          </p>

          {/* Preview card */}
          <div className="card text-left mb-8 text-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{selectedCat?.icon || '📌'}</span>
              <span className="badge-purple text-xs">{selectedCat?.label || submittedForm.category}</span>
              <span className="badge-green text-xs ml-auto">Open</span>
            </div>
            <h3 className="font-bold text-white mb-2">{submittedForm.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{submittedForm.description}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
              <span className="text-green-400 font-bold">
                ₹{submittedForm.budgetMin}{submittedForm.budgetMax ? `–₹${submittedForm.budgetMax}` : ''}
              </span>
              <span className="text-gray-500 text-xs">Deadline: {submittedForm.deadline || 'Flexible'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/my-hustles')} className="btn-primary flex-1 justify-center py-3">
              <Zap size={16} /> My Hustles
            </button>
            <button onClick={() => navigate('/explore')} className="btn-secondary flex-1 justify-center py-3">
              Explore
            </button>
            <button
              onClick={() => { setSubmitted(false); setSubmittedForm(null); setForm({ title:'',category:'',description:'',budgetMin:'',budgetMax:'',deadline:'',tags:'',contactPref:'offers' }); setStep(1); }}
              className="btn-ghost py-3 text-gray-500"
            >
              Post another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {step > 1 ? 'Previous step' : 'Back'}
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Post a Hustle</h1>
          <p className="text-gray-500 text-sm">Tell the campus what you need. Get offers in minutes.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mb-10">
          {[
            { n: 1, label: 'Details' },
            { n: 2, label: 'Budget & Deadline' },
            { n: 3, label: 'Review & Post' },
          ].map(({ n, label }, i, arr) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => n < step && setStep(n)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > n
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-400'
                      : step === n
                      ? 'text-white cursor-default'
                      : 'bg-white/8 text-gray-600 cursor-default'
                  }`}
                  style={step === n ? { background: 'linear-gradient(135deg, #9333ea, #3b82f6)' } : {}}
                  disabled={n >= step}
                >
                  {step > n ? <CheckCircle2 size={14} /> : n}
                </button>
                <span className={`text-xs font-medium hidden sm:block ${step >= n ? 'text-white' : 'text-gray-600'}`}>{label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="h-px flex-1 mx-3 transition-all" style={{ background: step > n ? 'linear-gradient(90deg, #22c55e, #9333ea)' : 'rgba(255,255,255,0.08)' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Details ── */}
        {step === 1 && (
          <div className="card space-y-6 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 flex items-center justify-between">
                <span>Hustle Title <span className="text-red-400">*</span></span>
                <span className={`font-normal ${form.title.length > 90 ? 'text-orange-400' : 'text-gray-600'}`}>{form.title.length}/100</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value.slice(0, 100))}
                placeholder="e.g. Need a Marketing PPT for BBA presentation"
                className={`input-field ${errors.title ? 'border-red-500/60 focus:border-red-500' : ''}`}
                autoFocus
              />
              {errors.title && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><X size={11} />{errors.title}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-3 block">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => update('category', cat.id)}
                    className={`p-3 rounded-xl text-center text-xs font-medium transition-all cursor-pointer ${
                      form.category === cat.id
                        ? 'text-white border border-purple-500/60 bg-purple-500/18 shadow-purple-glow'
                        : 'text-gray-400 bg-white/5 border border-white/8 hover:border-purple-500/30 hover:text-gray-200 hover:bg-white/8'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{cat.icon}</div>
                    <div className="leading-tight">{cat.label}</div>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><X size={11} />{errors.category}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 flex items-center justify-between">
                <span>Description <span className="text-red-400">*</span></span>
                <span className={`font-normal ${form.description.length < 30 ? 'text-gray-600' : 'text-green-500'}`}>{form.description.length} chars</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe exactly what you need — include specific requirements, format, references, and any relevant context..."
                rows={5}
                className={`input-field resize-none ${errors.description ? 'border-red-500/60' : ''}`}
              />
              {errors.description
                ? <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><X size={11} />{errors.description}</p>
                : form.description.length < 30
                ? <p className="text-gray-600 text-xs mt-1">{30 - form.description.length} more characters needed</p>
                : <p className="text-green-500 text-xs mt-1">✓ Looking good!</p>
              }
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Tags <span className="text-gray-600 font-normal">(optional, comma-separated)</span></label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="e.g. PowerPoint, Marketing, Design"
                className="input-field"
              />
              {form.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span key={t} className="tag-pill text-xs">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Budget & Deadline ── */}
        {step === 2 && (
          <div className="card space-y-6 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-3 block">
                Budget Range (₹) <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">Minimum</label>
                  <input
                    type="number"
                    value={form.budgetMin}
                    onChange={(e) => update('budgetMin', e.target.value)}
                    placeholder="e.g. 200"
                    min={1}
                    className={`input-field ${errors.budgetMin ? 'border-red-500/60' : ''}`}
                  />
                  {errors.budgetMin && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><X size={11} />{errors.budgetMin}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">Maximum <span className="text-gray-700">(optional)</span></label>
                  <input
                    type="number"
                    value={form.budgetMax}
                    onChange={(e) => update('budgetMax', e.target.value)}
                    placeholder="e.g. 500"
                    min={form.budgetMin || 1}
                    className={`input-field ${errors.budgetMax ? 'border-red-500/60' : ''}`}
                  />
                  {errors.budgetMax && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><X size={11} />{errors.budgetMax}</p>}
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-blue-500/8 border border-blue-500/15">
                <p className="text-xs text-blue-400 font-semibold mb-2">💡 Budget Guide for {selectedCat?.label || 'your category'}</p>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500">
                  {selectedCat?.id === 'tutoring' && (<><span>Per session: ₹150–300</span><span>4+ sessions: ₹400–600</span></>)}
                  {selectedCat?.id === 'design' && (<><span>PPT (10 slides): ₹200–400</span><span>Logo: ₹300–600</span></>)}
                  {selectedCat?.id === 'photography' && (<><span>1–2 hrs: ₹500–800</span><span>4+ hrs: ₹1000–2000</span></>)}
                  {selectedCat?.id === 'tech' && (<><span>Small project: ₹300–600</span><span>Full project: ₹600–1500</span></>)}
                  {selectedCat?.id === 'notes' && (<><span>Per chapter: ₹30–80</span><span>Full subject: ₹150–300</span></>)}
                  {selectedCat?.id === 'food' && (<><span>Snacks: ₹80–200</span><span>Full meal: ₹100–250</span></>)}
                  {(!selectedCat || ['buysell','services'].includes(selectedCat.id)) && (<><span>Small task: ₹100–300</span><span>Big task: ₹300–1000</span></>)}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-3 block">
                Deadline <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {['Today', 'Tomorrow', '2–3 Days', 'This Week', '2 Weeks', 'Flexible'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => update('deadline', d)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                      form.deadline === d
                        ? 'text-white border border-purple-500/60 bg-purple-500/18'
                        : 'text-gray-400 bg-white/5 border border-white/8 hover:border-purple-500/30 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {errors.deadline && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><X size={11} />{errors.deadline}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-3 block">Contact Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'offers', emoji: '📬', label: 'Receive Offers', desc: 'Students submit their price and pitch to you' },
                  { id: 'direct', emoji: '💬', label: 'Direct Messages', desc: 'Students message you directly to discuss' },
                ].map(({ id, emoji, label, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => update('contactPref', id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      form.contactPref === id
                        ? 'text-white border border-purple-500/60 bg-purple-500/15'
                        : 'text-gray-400 bg-white/5 border border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">{emoji} {label}</div>
                    <div className="text-xs text-gray-600 leading-relaxed">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review ── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="card">
              <h3 className="font-bold text-white text-base mb-5 flex items-center gap-2">
                <span>Review Your Hustle</span>
                <span className="badge-green text-xs">Ready to post</span>
              </h3>
              <div className="space-y-4">
                <Row label="Title" value={form.title} />
                <div className="divider" />
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Category</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedCat?.icon}</span>
                    <span className="text-white text-sm font-medium">{selectedCat?.label}</span>
                  </div>
                </div>
                <div className="divider" />
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Description</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{form.description}</p>
                </div>
                <div className="divider" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Budget</p>
                    <p className="text-green-400 font-bold text-sm">
                      ₹{form.budgetMin}{form.budgetMax && Number(form.budgetMax) > Number(form.budgetMin) ? `–₹${form.budgetMax}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Deadline</p>
                    <p className="text-white text-sm font-semibold">{form.deadline}</p>
                  </div>
                </div>
                {form.tags && (
                  <>
                    <div className="divider" />
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                          <span key={t} className="tag-pill">{t}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-green-500/20 bg-green-500/[0.06]">
              <div className="flex items-start gap-3">
                <Info size={15} className="text-green-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your hustle will be visible to all students on Campus Hustle immediately. You'll receive a notification when someone makes an offer.
                </p>
              </div>
            </div>

            {/* Edit links */}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost text-xs text-gray-500 border border-white/10 px-4 py-2 rounded-xl hover:border-purple-500/30">
                ← Edit Details
              </button>
              <button onClick={() => setStep(2)} className="btn-ghost text-xs text-gray-500 border border-white/10 px-4 py-2 rounded-xl hover:border-purple-500/30">
                ← Edit Budget
              </button>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="btn-ghost text-gray-400 hover:text-white"
          >
            <ArrowLeft size={16} /> {step > 1 ? 'Back' : 'Cancel'}
          </button>

          {step < 3 ? (
            <button onClick={handleNext} className="btn-primary px-8 py-3">
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary px-8 py-3 gap-2">
              <Zap size={16} />
              Post Hustle 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1.5">{label}</p>
    <p className="text-white text-sm font-medium">{value}</p>
  </div>
);

export default PostHustlePage;
