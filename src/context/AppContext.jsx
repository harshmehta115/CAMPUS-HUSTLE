import { createContext, useContext, useState, useCallback } from "react";
import {
  hustles as initialHustles,
  myHustles as initialMyHustles,
  notifications as initialNotifications,
  currentUser as initialUser,
  offers as initialOffers,
} from "../data/mockData";

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [hustles, setHustles] = useState(initialHustles);
  const [myPosted, setMyPosted] = useState(initialMyHustles.posted);
  const [myActive, setMyActive] = useState(initialMyHustles.active);
  const [myCompleted, setMyCompleted] = useState(initialMyHustles.completed);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [user, setUser] = useState({ ...initialUser, hustleCoins: initialUser.totalEarnings, withdrawalHistory: [] });
  const [offers, setOffers] = useState(initialOffers);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const postHustle = useCallback((form) => {
    const newHustle = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      category: form.category,
      budget: { min: Number(form.budgetMin), max: Number(form.budgetMax) || Number(form.budgetMin) },
      deadline: form.deadline || "Flexible",
      status: "open",
      poster: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        college: user.college,
        rating: user.rating,
        reviews: user.reviews,
      },
      offers: 0,
      views: 0,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      postedAt: "Just now",
    };
    const newPosted = {
      id: newHustle.id,
      title: form.title,
      category: form.category,
      budget: newHustle.budget,
      deadline: form.deadline || "Flexible",
      status: "active",
      offers: 0,
      views: 0,
      postedAt: "Just now",
    };
    setHustles((prev) => [newHustle, ...prev]);
    setMyPosted((prev) => [newPosted, ...prev]);
    addToast('"' + form.title + '" is now live on Campus Hustle!');
  }, [user, addToast]);

  const deletePosted = useCallback((id) => {
    setMyPosted((prev) => prev.filter((h) => h.id !== id));
    setHustles((prev) => prev.filter((h) => h.id !== id));
    addToast("Hustle deleted.", "info");
  }, [addToast]);

  const markComplete = useCallback((id) => {
    const hustle = myActive.find((h) => h.id === id);
    if (!hustle) return;
    const coinsEarned = hustle.budget || hustle.earnings;
    const completedEntry = {
      id: hustle.id,
      title: hustle.title,
      category: hustle.category,
      earnings: coinsEarned,
      client: hustle.client,
      clientAvatar: hustle.clientAvatar,
      completedAt: "Just now",
      rating: 5,
      review: "Great work! Very professional.",
    };
    setMyActive((prev) => prev.filter((h) => h.id !== id));
    setMyCompleted((prev) => [completedEntry, ...prev]);
    setUser((prev) => ({
      ...prev,
      totalEarnings: prev.totalEarnings + coinsEarned,
      totalHustles: prev.totalHustles + 1,
      hustleCoins: (prev.hustleCoins || 0) + coinsEarned,
    }));
    addToast("Hustle complete! +" + coinsEarned + " Hustle Coins earned");
  }, [myActive, addToast]);

  const updateBio = useCallback((bio) => {
    setUser((prev) => ({ ...prev, bio }));
    addToast("Profile updated!");
  }, [addToast]);

  const updateSkills = useCallback((skills) => {
    setUser((prev) => ({ ...prev, skills }));
  }, []);

  const addNotification = useCallback((message, type = "offer") => {
    const newNotif = { id: Date.now(), type, message, time: "Just now", read: false };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const acceptOffer = useCallback((hustleId, offer) => {
    setHustles((prev) => prev.map((h) => h.id === hustleId ? { ...h, status: "active" } : h));
    setMyPosted((prev) => prev.map((h) => h.id === hustleId ? { ...h, status: "active", acceptedOffer: offer } : h));
    addNotification("You accepted " + offer.offerBy.name + "'s offer of " + offer.price + " Hustle Coins!");
    addToast("Offer accepted! Working with " + offer.offerBy.name);
  }, [addToast]);

  const sendOffer = useCallback((hustleId, price, message) => {
    const newOffer = {
      id: Date.now(),
      hustleId,
      offerBy: { id: user.id, name: user.name, avatar: user.avatar, rating: user.rating, reviews: user.reviews, college: user.college },
      price: Number(price),
      message,
      deliveryTime: "To be discussed",
      postedAt: "Just now",
    };
    setOffers((prev) => [newOffer, ...prev]);
    setHustles((prev) => prev.map((h) => h.id === hustleId ? { ...h, offers: h.offers + 1 } : h));
    addToast("Offer sent! The poster will review it shortly");
  }, [user, addToast]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateProgress = useCallback((id, progress) => {
    setMyActive((prev) => prev.map((h) => h.id === id ? { ...h, progress } : h));
  }, []);

  const requestWithdrawal = useCallback((upiId, amount) => {
    const coins = user.hustleCoins || 0;
    if (amount > coins) { addToast("Insufficient Hustle Coins balance.", "error"); return false; }
    const withdrawal = {
      id: Date.now(),
      upiId,
      amount,
      requestedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "pending",
    };
    setUser((prev) => ({
      ...prev,
      hustleCoins: (prev.hustleCoins || 0) - amount,
      withdrawalHistory: [withdrawal, ...(prev.withdrawalHistory || [])],
    }));
    addToast("Withdrawal of " + amount + " coins requested! Processed at month-end.");
    return true;
  }, [user, addToast]);

  const logout = useCallback(() => {
    localStorage.removeItem("ch_user_session");
    window.location.reload();
  }, []);

  return (
    <AppContext.Provider value={{
      hustles, myPosted, myActive, myCompleted, notifications, user, offers, toasts,
      postHustle, deletePosted, markComplete, updateBio, updateSkills,
      acceptOffer, sendOffer, addNotification, markAllRead, updateProgress,
      addToast, requestWithdrawal, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};