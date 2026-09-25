import { useState, useEffect, useRef } from "react";
import { Zap, ArrowRight, Phone, Mail, User, RefreshCw, CheckCircle2, X } from "lucide-react";

const PHONE_RE = /^[6-9]\d{9}$/;
const GMAIL_RE = /^[a-zA-Z0-9._%+\-]+@gmail\.com$/i;

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// Defined OUTSIDE AuthPage so React never remounts it on re-render
const Field = ({ fieldKey, label, placeholder, type = "text", icon, value, error, onChange }) => (
  <div>
    <label className="text-xs font-semibold text-gray-400 mb-2 block">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={"input-field pl-10 " + (error ? "border-red-500/60 bg-red-500/5" : "")}
      />
    </div>
    {error && (
      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
        <X size={11} /> {error}
      </p>
    )}
  </div>
);

const AuthPage = ({ onLogin }) => {
  const [step, setStep] = useState("signup");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showOtpHint, setShowOtpHint] = useState(true);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const startCooldown = () => {
    setResendCooldown(30);
    timerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Enter your full name (min 2 chars).";
    if (!PHONE_RE.test(form.phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!GMAIL_RE.test(form.email)) e.email = "Enter a valid Gmail address (e.g. you@gmail.com).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const code = generateOtp();
    setGeneratedOtp(code);
    setStep("otp");
    setShowOtpHint(true);
    startCooldown();
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setOtpError("");
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const entered = otp.join("");
    if (entered.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    if (entered !== generatedOtp) { setOtpError("Incorrect OTP. Please try again."); return; }
    setVerified(true);
    setTimeout(() => {
      const userData = {
        name: form.name.trim(),
        phone: form.phone,
        email: form.email,
        avatar: form.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        loggedIn: true,
      };
      localStorage.setItem("ch_user_session", JSON.stringify(userData));
      onLogin(userData);
    }, 1200);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    const code = generateOtp();
    setGeneratedOtp(code);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setShowOtpHint(true);
    startCooldown();
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "#05070f" }}>
      <div className="blob blob-purple w-96 h-96 top-0 -left-20 opacity-20" style={{ position: "absolute" }} />
      <div className="blob blob-blue w-80 h-80 bottom-0 right-0 opacity-15" style={{ position: "absolute" }} />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #9333ea, #3b82f6)" }}>
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="font-black text-xl gradient-text">CAMPUS</span>
          <span className="font-black text-xl text-white">HUSTLE</span>
        </div>

        {step === "signup" && (
          <div className="card page-enter" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3" style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc" }}>
                ✨ Campus Marketplace
              </div>
              <h1 className="text-2xl font-black text-white mb-1">Join the Hustle</h1>
              <p className="text-gray-500 text-sm">Create your free student account</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <Field fieldKey="name" label="Full Name" placeholder="Your full name" type="text"
                icon={<User size={15} />} value={form.name} error={errors.name} onChange={handleChange("name")} />
              <Field fieldKey="phone" label="Phone Number" placeholder="10-digit mobile number" type="tel"
                icon={<Phone size={15} />} value={form.phone} error={errors.phone} onChange={handleChange("phone")} />
              <Field fieldKey="email" label="Gmail Address" placeholder="yourname@gmail.com" type="email"
                icon={<Mail size={15} />} value={form.email} error={errors.email} onChange={handleChange("email")} />
              <button type="submit" className="btn-primary w-full justify-center py-3.5 mt-2">
                Get OTP <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-5">
              By signing up, you agree to our{" "}
              <span className="text-purple-400 cursor-pointer hover:text-purple-300">Terms</span> &amp;{" "}
              <span className="text-purple-400 cursor-pointer hover:text-purple-300">Privacy Policy</span>
            </p>

            <div className="mt-5 rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}>
              <span className="text-2xl">🪙</span>
              <div>
                <p className="text-xs font-semibold text-yellow-400">Earn Hustle Coins</p>
                <p className="text-xs text-gray-500">Complete hustles to earn coins &amp; withdraw via UPI</p>
              </div>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="card page-enter" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.2)" }}>
            {verified ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" style={{ animation: "bounce 1s infinite" }} />
                <h2 className="text-xl font-black text-white mb-1">Verified! 🎉</h2>
                <p className="text-gray-500 text-sm">Setting up your account...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-7">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
                    📱
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">Verify OTP</h2>
                  <p className="text-gray-400 text-sm">
                    Sent to <span className="text-white font-semibold">+91 {form.phone}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">&amp; {form.email}</p>
                </div>

                {showOtpHint && (
                  <div className="mb-5 rounded-xl p-3 flex items-start justify-between gap-3" style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)" }}>
                    <div>
                      <p className="text-xs font-semibold text-yellow-400 mb-0.5">🔧 Demo Mode</p>
                      <p className="text-xs text-gray-400">
                        No real SMS is sent. Your OTP is:{" "}
                        <span className="font-black text-yellow-300 tracking-widest text-sm">{generatedOtp}</span>
                      </p>
                    </div>
                    <button onClick={() => setShowOtpHint(false)} className="text-gray-600 hover:text-gray-400 shrink-0 mt-0.5">
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex gap-2.5 justify-center mb-6" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: "3rem", height: "3.5rem",
                        textAlign: "center", fontSize: "1.25rem", fontWeight: 900,
                        borderRadius: "0.75rem", outline: "none",
                        transition: "all 0.15s",
                        background: digit ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)",
                        border: "2px solid " + (otpError ? "rgba(239,68,68,0.6)" : digit ? "rgba(168,85,247,0.7)" : "rgba(255,255,255,0.15)"),
                        color: "white",
                      }}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-red-400 text-xs text-center mb-4 flex items-center justify-center gap-1">
                    <X size={12} /> {otpError}
                  </p>
                )}

                <button
                  onClick={handleVerify}
                  disabled={otp.some((d) => !d)}
                  className="btn-primary w-full justify-center py-3.5 mb-4"
                  style={{ opacity: otp.some((d) => !d) ? 0.4 : 1, cursor: otp.some((d) => !d) ? "not-allowed" : "pointer" }}
                >
                  <CheckCircle2 size={16} /> Verify &amp; Enter
                </button>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { setStep("signup"); setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    ← Change number
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: resendCooldown > 0 ? "#4b5563" : "#c084fc", cursor: resendCooldown > 0 ? "not-allowed" : "pointer" }}
                  >
                    <RefreshCw size={12} />
                    {resendCooldown > 0 ? "Resend in " + resendCooldown + "s" : "Resend OTP"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-700 mt-6">
          🎓 Campus Hustle · ITBM College · Demo / Simulated platform
        </p>
      </div>
    </div>
  );
};

export default AuthPage;