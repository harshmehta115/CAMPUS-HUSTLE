import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
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
  // undefined = still checking auth state (loading)
  // null      = not logged in
  // object    = logged in Firebase user
  const [firebaseUser, setFirebaseUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user ?? null);
    });
    return unsub;
  }, []);

  // Checking auth state
  if (firebaseUser === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05070f",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "linear-gradient(135deg, #9333ea, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          ⚡
        </div>
        <p style={{ color: "#6b7280", fontSize: 13 }}>Loading Campus Hustle…</p>
      </div>
    );
  }

  // Not logged in → show auth
  if (!firebaseUser) {
    return <AuthPage />;
  }

  // Logged in → show main app
  return (
    <HashRouter>
      <AppProvider firebaseUser={firebaseUser}>
        <div className="min-h-screen" style={{ background: "#05070f" }}>
          <Navbar />
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