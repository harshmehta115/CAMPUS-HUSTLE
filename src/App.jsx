import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import HustleDetailPage from "./pages/HustleDetailPage";
import PostHustlePage from "./pages/PostHustlePage";
import MyHustlesPage from "./pages/MyHustlesPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ch_user_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.loggedIn) setAuthUser(parsed);
      }
    } catch (e) {
      localStorage.removeItem("ch_user_session");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#05070f" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #9333ea, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24
          }}>⚡</div>
          <p style={{ color: "#6b7280", fontSize: 13 }}>Loading Campus Hustle...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return <AuthPage onLogin={(u) => setAuthUser(u)} />;
  }

  return (
    <HashRouter>
      <AppProvider>
        <div className="min-h-screen bg-navy-950">
          <Navbar onLogout={() => { localStorage.removeItem("ch_user_session"); setAuthUser(null); }} authUser={authUser} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/hustle/:id" element={<HustleDetailPage />} />
            <Route path="/post" element={<PostHustlePage />} />
            <Route path="/my-hustles" element={<MyHustlesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </div>
      </AppProvider>
    </HashRouter>
  );
}

export default App;