import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
  arrayUnion, arrayRemove, increment, writeBatch,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { hustles as seedHustles } from "../data/mockData";

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

const DEFAULT_USER = {
  id: "",
  name: "Student",
  avatar: "ST",
  college: "ITBM College",
  year: "Student",
  bio: "Campus Hustler",
  skills: [],
  hustleCoins: 0,
  totalEarnings: 0,
  totalHustles: 0,
  rating: 5.0,
  reviews: 0,
  completionRate: 100,
  responseTime: "< 1 hour",
  joinedAt: "September 2026",
  social: { instagram: "", linkedin: "", github: "" },
  withdrawalHistory: [],
  myActive: [],
  myCompleted: [],
  notifications: [],
};

export const AppProvider = ({ children, firebaseUser }) => {
  const [hustles, setHustles] = useState([]);
  const [offers, setOffers] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Real-time: hustles collection
  useEffect(() => {
    const q = query(collection(db, "hustles"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        // Seed demo hustles on first run so app is not empty
        const batch = writeBatch(db);
        seedHustles.slice(0, 8).forEach((h) => {
          const ref = doc(collection(db, "hustles"));
          const { id: _id, ...rest } = h;
          batch.set(ref, { ...rest, seeded: true, createdAt: serverTimestamp() });
        });
        await batch.commit();
      } else {
        setHustles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setDataLoading(false);
      }
    });
    return unsub;
  }, []);

  // Real-time: offers collection
  useEffect(() => {
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Real-time: current user profile
  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const unsub = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
      if (snap.exists()) {
        setUserProfile({ ...snap.data(), id: firebaseUser.uid });
      }
    });
    return unsub;
  }, [firebaseUser?.uid]);

  // Derived: hustles posted by current user
  const myPosted = useMemo(() => {
    if (!userProfile) return [];
    return hustles.filter((h) => h.poster?.id === userProfile.id);
  }, [hustles, userProfile]);

  const myActive = userProfile?.myActive ?? [];
  const myCompleted = userProfile?.myCompleted ?? [];
  const notifications = userProfile?.notifications ?? [];

  // Toast helper
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // Post a hustle
  const postHustle = useCallback(async (form) => {
    if (!userProfile) return;
    await addDoc(collection(db, "hustles"), {
      title: form.title,
      description: form.description,
      category: form.category,
      budget: { min: Number(form.budgetMin), max: Number(form.budgetMax) || Number(form.budgetMin) },
      deadline: form.deadline || "Flexible",
      status: "open",
      poster: {
        id: userProfile.id,
        name: userProfile.name,
        avatar: userProfile.avatar,
        college: userProfile.college,
        rating: userProfile.rating,
        reviews: userProfile.reviews,
      },
      offers: 0,
      views: 0,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      createdAt: serverTimestamp(),
      postedAt: "Just now",
    });
    addToast("Your hustle is now live on Campus Hustle!");
  }, [userProfile, addToast]);

  // Delete a posted hustle
  const deletePosted = useCallback(async (id) => {
    await deleteDoc(doc(db, "hustles", id));
    addToast("Hustle deleted.", "info");
  }, [addToast]);

  // Mark active hustle as complete
  const markComplete = useCallback(async (hustleId) => {
    if (!userProfile) return;
    const hustle = myActive.find((h) => h.id === hustleId);
    if (!hustle) return;
    const coins = hustle.budget || hustle.earnings || 50;
    const completedEntry = {
      id: hustle.id,
      title: hustle.title,
      category: hustle.category || "general",
      earnings: coins,
      client: hustle.client || "Unknown",
      clientAvatar: hustle.clientAvatar || "U",
      completedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      rating: 5,
      review: "Great work! Very professional.",
    };
    await updateDoc(doc(db, "users", userProfile.id), {
      myActive: arrayRemove(hustle),
      myCompleted: arrayUnion(completedEntry),
      totalEarnings: increment(coins),
      totalHustles: increment(1),
      hustleCoins: increment(coins),
    });
    addToast("Hustle complete! +" + coins + " Hustle Coins earned 🪙");
  }, [userProfile, myActive, addToast]);

  // Update bio
  const updateBio = useCallback(async (bio) => {
    if (!userProfile) return;
    await updateDoc(doc(db, "users", userProfile.id), { bio });
    addToast("Profile updated!");
  }, [userProfile, addToast]);

  // Update skills
  const updateSkills = useCallback(async (skills) => {
    if (!userProfile) return;
    await updateDoc(doc(db, "users", userProfile.id), { skills });
  }, [userProfile]);

  // Send an offer
  const sendOffer = useCallback(async (hustleId, price, message) => {
    if (!userProfile) return;
    await addDoc(collection(db, "offers"), {
      hustleId,
      offerBy: {
        id: userProfile.id,
        name: userProfile.name,
        avatar: userProfile.avatar,
        rating: userProfile.rating,
        reviews: userProfile.reviews,
        college: userProfile.college,
      },
      price: Number(price),
      message,
      deliveryTime: "To be discussed",
      createdAt: serverTimestamp(),
      postedAt: "Just now",
    });
    await updateDoc(doc(db, "hustles", hustleId), { offers: increment(1) });
    addToast("Offer sent! The poster will review it shortly 📬");
  }, [userProfile, addToast]);

  // Accept an offer
  const acceptOffer = useCallback(async (hustleId, offer) => {
    if (!userProfile) return;
    await updateDoc(doc(db, "hustles", hustleId), { status: "active" });
    const notif = {
      id: Date.now(),
      type: "offer",
      message: "You accepted " + offer.offerBy.name + "'s offer of " + offer.price + " Hustle Coins!",
      time: "Just now",
      read: false,
    };
    await updateDoc(doc(db, "users", userProfile.id), { notifications: arrayUnion(notif) });
    addToast("Offer accepted! Working with " + offer.offerBy.name + " 🤝");
  }, [userProfile, addToast]);

  // Mark all notifications as read
  const markAllRead = useCallback(async () => {
    if (!userProfile) return;
    const updated = notifications.map((n) => ({ ...n, read: true }));
    await updateDoc(doc(db, "users", userProfile.id), { notifications: updated });
  }, [userProfile, notifications]);

  // Update active hustle progress
  const updateProgress = useCallback(async (id, progress) => {
    if (!userProfile) return;
    const updated = myActive.map((h) => (h.id === id ? { ...h, progress } : h));
    await updateDoc(doc(db, "users", userProfile.id), { myActive: updated });
  }, [userProfile, myActive]);

  // Request withdrawal
  const requestWithdrawal = useCallback(async (upiId, amount) => {
    if (!userProfile) return false;
    const coins = userProfile.hustleCoins || 0;
    if (amount > coins) { addToast("Insufficient Hustle Coins balance.", "error"); return false; }
    const withdrawal = {
      id: Date.now(),
      upiId,
      amount,
      requestedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "pending",
    };
    await updateDoc(doc(db, "users", userProfile.id), {
      hustleCoins: increment(-amount),
      withdrawalHistory: arrayUnion(withdrawal),
    });
    addToast("Withdrawal of " + amount + " coins requested! Processed at month-end. 💸");
    return true;
  }, [userProfile, addToast]);

  // Add a notification
  const addNotification = useCallback(async (message, type = "offer") => {
    if (!userProfile) return;
    const notif = { id: Date.now(), type, message, time: "Just now", read: false };
    await updateDoc(doc(db, "users", userProfile.id), { notifications: arrayUnion(notif) });
  }, [userProfile]);

  // Logout
  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const user = userProfile ?? { ...DEFAULT_USER, id: firebaseUser?.uid ?? "" };

  return (
    <AppContext.Provider
      value={{
        hustles, myPosted, myActive, myCompleted, notifications,
        user, offers, toasts, dataLoading,
        postHustle, deletePosted, markComplete, updateBio, updateSkills,
        sendOffer, acceptOffer, markAllRead, updateProgress,
        addToast, addNotification, requestWithdrawal, logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
