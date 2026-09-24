import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import HustleDetailPage from './pages/HustleDetailPage';
import PostHustlePage from './pages/PostHustlePage';
import MyHustlesPage from './pages/MyHustlesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-navy-950">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/hustle/:id" element={<HustleDetailPage />} />
            <Route path="/post" element={<PostHustlePage />} />
            <Route path="/my-hustles" element={<MyHustlesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <Toast />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
