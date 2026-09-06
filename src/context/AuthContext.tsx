import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  JobCategory, 
  ColorTheme, 
  EventItem, 
  JobApplication, 
  ChatMessage, 
  Conversation, 
  Transaction, 
  Review, 
  NotificationItem, 
  Complaint,
  Dispute,
  Invoice
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_APPLICATIONS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_COMPLAINTS,
  INITIAL_DISPUTES,
  INITIAL_INVOICES
} from '../data/initialData';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  getMinimumWalletBalance,
  isWalletBalanceMaintained,
  validateWithdrawal
} from '../utils/walletRules';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User;
  users: User[];
  events: EventItem[];
  applications: JobApplication[];
  conversations: Conversation[];
  messages: ChatMessage[];
  transactions: Transaction[];
  reviews: Review[];
  notifications: NotificationItem[];
  complaints: Complaint[];
  disputes: Dispute[];
  invoices: Invoice[];
  isOffline: boolean;
  toggleOfflineMode: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string) => boolean;
  logoutUser: () => void;
  signupUser: (name: string, email: string, role: UserRole, city: string, extra?: { phone?: string; skills?: JobCategory[]; hourlyRate?: number; bio?: string }) => void;
  createEvent: (newEvent: Omit<EventItem, 'id' | 'createdAt' | 'organizerId' | 'organizerName' | 'organizerAvatar' | 'organizerRating'>) => void;
  updateEventStatus: (eventId: string, status: EventItem['status']) => void;
  applyForJob: (eventId: string, jobRoleId: string, jobRoleTitle: string, payAmount: number, coverNote: string) => void;
  updateApplicationStatus: (applicationId: string, status: JobApplication['status']) => void;
  startOrGetConversation: (arg1: string, arg2?: string, arg3?: string) => string;
  createGroupChat: (eventId: string, eventTitle: string, participantIds: string[]) => string;
  sendMessage: (recipientId: string, conversationId: string, messageText: string, eventId?: string) => void;
  releasePayout: (applicationId: string) => void;
  postReview: (eventId: string, eventTitle: string, targetId: string, targetName: string, rating: number, comment: string) => void;
  markNotificationRead: (notifId: string) => void;
  resolveComplaint: (complaintId: string, resolution: string) => void;
  addFundsToWallet: (amount: number) => void;
  withdrawFundsFromWallet: (
    amount: number,
    details: {
      method: 'bank' | 'upi';
      bankDetails?: {
        accountHolder: string;
        bankName: string;
        accountNumber: string;
        ifsc: string;
        accountType: string;
      };
      upiDetails?: {
        upiId: string;
        accountHolder: string;
        provider: string;
      };
    }
  ) => { success: boolean; error?: string };
  minRequiredWalletBalance: number;
  isWalletBalanceCompliant: boolean;
  fileDispute: (disputeData: Omit<Dispute, 'id' | 'createdAt' | 'status'>) => void;
  resolveDispute: (disputeId: string, resolution: 'resolved_worker' | 'resolved_organizer' | 'resolved_split', notes: string) => void;
  generateInvoice: (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => Invoice;
  submitIdentityVerification: (docType: string, docNumber: string) => void;
  verifyUserIdentity: (userId: string, status: 'verified' | 'unverified') => void;
  toggle2FA: (enable: boolean) => void;
  updateSubscription: (tier: 'starter' | 'pro' | 'enterprise') => void;
  toggleAvailability: (dateStr: string, status: 'available' | 'busy') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem('eventcrew_current_role') as UserRole;
    if (savedRole) {
      const match = INITIAL_USERS.find(u => u.role === savedRole);
      if (match) return match;
    }
    return INITIAL_USERS[0]; // default organizer
  });

  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('eventcrew_logged_in') === 'true';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('eventcrew_theme');
    return saved === 'dark';
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const savedColor = localStorage.getItem('eventcrew_color_theme') as ColorTheme;
    return savedColor || 'emerald';
  });

  // Real-time Firestore sync & seeding
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (snapshot.empty) {
        // Seed initial users to Firestore
        const batch = writeBatch(db);
        INITIAL_USERS.forEach(u => batch.set(doc(db, 'users', u.id), u));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'users'));
      } else {
        const list = snapshot.docs.map(doc => doc.data() as User);
        setUsers(list);
        // Sync current active user reference if updated
        setCurrentUser(curr => list.find(u => u.id === curr.id) || curr);
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'users'));

    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_EVENTS.forEach(e => batch.set(doc(db, 'events', e.id), e));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'events'));
      } else {
        setEvents(snapshot.docs.map(doc => doc.data() as EventItem));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'events'));

    const unsubApps = onSnapshot(collection(db, 'applications'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_APPLICATIONS.forEach(a => batch.set(doc(db, 'applications', a.id), a));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'applications'));
      } else {
        setApplications(snapshot.docs.map(doc => doc.data() as JobApplication));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'applications'));

    const unsubConvs = onSnapshot(collection(db, 'conversations'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_CONVERSATIONS.forEach(c => batch.set(doc(db, 'conversations', c.id), c));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'conversations'));
      } else {
        setConversations(snapshot.docs.map(doc => doc.data() as Conversation));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'conversations'));

    const unsubMsgs = onSnapshot(collection(db, 'messages'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_MESSAGES.forEach(m => batch.set(doc(db, 'messages', m.id), m));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'messages'));
      } else {
        setMessages(snapshot.docs.map(doc => doc.data() as ChatMessage));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'messages'));

    const unsubTxs = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_TRANSACTIONS.forEach(t => batch.set(doc(db, 'transactions', t.id), t));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'transactions'));
      } else {
        setTransactions(snapshot.docs.map(doc => doc.data() as Transaction));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'transactions'));

    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_REVIEWS.forEach(r => batch.set(doc(db, 'reviews', r.id), r));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'reviews'));
      } else {
        setReviews(snapshot.docs.map(doc => doc.data() as Review));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'reviews'));

    const unsubNotifs = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_NOTIFICATIONS.forEach(n => batch.set(doc(db, 'notifications', n.id), n));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'notifications'));
      } else {
        setNotifications(snapshot.docs.map(doc => doc.data() as NotificationItem));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'notifications'));

    const unsubComplaints = onSnapshot(collection(db, 'complaints'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_COMPLAINTS.forEach(c => batch.set(doc(db, 'complaints', c.id), c));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'complaints'));
      } else {
        setComplaints(snapshot.docs.map(doc => doc.data() as Complaint));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'complaints'));

    const unsubDisputes = onSnapshot(collection(db, 'disputes'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_DISPUTES.forEach(d => batch.set(doc(db, 'disputes', d.id), d));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'disputes'));
      } else {
        setDisputes(snapshot.docs.map(doc => doc.data() as Dispute));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'disputes'));

    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_INVOICES.forEach(inv => batch.set(doc(db, 'invoices', inv.id), inv));
        batch.commit().catch(err => handleFirestoreError(err, OperationType.WRITE, 'invoices'));
      } else {
        setInvoices(snapshot.docs.map(doc => doc.data() as Invoice));
      }
    }, err => handleFirestoreError(err, OperationType.LIST, 'invoices'));

    return () => {
      unsubUsers();
      unsubEvents();
      unsubApps();
      unsubConvs();
      unsubMsgs();
      unsubTxs();
      unsubReviews();
      unsubNotifs();
      unsubComplaints();
      unsubDisputes();
      unsubInvoices();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('eventcrew_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('eventcrew_color_theme', colorTheme);
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const switchRole = (role: UserRole) => {
    localStorage.setItem('eventcrew_current_role', role);
    const match = users.find(u => u.role === role);
    if (match) {
      setCurrentUser(match);
    }
    setIsLoggedIn(true);
    localStorage.setItem('eventcrew_logged_in', 'true');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('eventcrew_logged_in');
  };

  const loginUser = (email: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('eventcrew_current_role', found.role);
      setIsLoggedIn(true);
      localStorage.setItem('eventcrew_logged_in', 'true');
      return true;
    }
    return false;
  };

  const signupUser = (name: string, email: string, role: UserRole, city: string, extra?: { phone?: string; skills?: JobCategory[]; hourlyRate?: number; bio?: string }) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      phone: extra?.phone || '+91 98765 00000',
      city: city || 'Mumbai',
      skills: extra?.skills || (role === 'worker' ? ['Catering', 'Hosting'] : undefined),
      hourlyRate: extra?.hourlyRate || (role === 'worker' ? 400 : undefined),
      bio: extra?.bio || (role === 'worker' ? 'Passionate part-time event crew member.' : role === 'organizer' ? 'Organizing high-impact events.' : 'Platform System Administrator'),
      rating: 5.0,
      reviewCount: 0,
      walletBalance: role === 'organizer' ? 10000 : role === 'worker' ? 2500 : 0,
      isVerified: true,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('eventcrew_current_role', role);
    setIsLoggedIn(true);
    localStorage.setItem('eventcrew_logged_in', 'true');

    // Save to Firestore
    setDoc(doc(db, 'users', newUser.id), newUser).catch(console.error);
  };

  const createEvent = (data: Omit<EventItem, 'id' | 'createdAt' | 'organizerId' | 'organizerName' | 'organizerAvatar' | 'organizerRating'>) => {
    const newEvent: EventItem = {
      ...data,
      id: `evt_${Date.now()}`,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      organizerAvatar: currentUser.avatar,
      organizerRating: currentUser.rating,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Save event to Firestore
    setDoc(doc(db, 'events', newEvent.id), newEvent).catch(console.error);

    // Add escrow lock transaction
    const totalBudget = data.budgetTotal || 500;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      type: 'escrow_deposit',
      amount: totalBudget,
      status: 'completed',
      description: `Escrow deposit for ${data.title}`,
      date: new Date().toISOString().split('T')[0],
      eventId: newEvent.id,
      eventTitle: data.title
    };
    setDoc(doc(db, 'transactions', newTx.id), newTx).catch(console.error);
  };

  const updateEventStatus = (eventId: string, status: EventItem['status']) => {
    updateDoc(doc(db, 'events', eventId), { status }).catch(console.error);
  };

  const applyForJob = (eventId: string, jobRoleId: string, jobRoleTitle: string, payAmount: number, coverNote: string) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return;

    const newApp: JobApplication = {
      id: `app_${Date.now()}`,
      eventId,
      eventTitle: targetEvent.title,
      eventBanner: targetEvent.bannerUrl,
      eventCity: targetEvent.city,
      eventDate: targetEvent.startDate,
      jobRoleId,
      jobRoleTitle,
      payAmount,
      workerId: currentUser.id,
      workerName: currentUser.name,
      workerAvatar: currentUser.avatar,
      workerRating: currentUser.rating,
      workerSkills: currentUser.skills || ['General Helper'],
      organizerId: targetEvent.organizerId,
      organizerName: targetEvent.organizerName,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
      coverNote,
      payoutStatus: 'unpaid'
    };

    setDoc(doc(db, 'applications', newApp.id), newApp).catch(console.error);

    // Send notification to organizer
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: targetEvent.organizerId,
      title: 'New Applicant Received 📩',
      message: `${currentUser.name} applied for ${jobRoleTitle} on "${targetEvent.title}".`,
      type: 'application',
      read: false,
      date: 'Just now'
    };
    setDoc(doc(db, 'notifications', notif.id), notif).catch(console.error);
  };

  const updateApplicationStatus = (applicationId: string, status: JobApplication['status']) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    const updates: Partial<JobApplication> = { status };
    if (status === 'accepted') {
      updates.payoutStatus = 'escrow';
      // Update filled count on event role in Firestore
      const targetEvent = events.find(e => e.id === app.eventId);
      if (targetEvent) {
        const updatedRoles = targetEvent.rolesNeeded.map(r => {
          if (r.id === app.jobRoleId) {
            return { ...r, quantityFilled: Math.min(r.quantityNeeded, r.quantityFilled + 1) };
          }
          return r;
        });
        updateDoc(doc(db, 'events', app.eventId), { rolesNeeded: updatedRoles }).catch(console.error);
      }

      // Automatically create / unlock chat thread between organizer and worker
      const existingConv = conversations.find(
        c => c.eventId === app.eventId && (c.participantId === app.workerId || c.participantId === app.organizerId)
      );

      let convId = existingConv?.id;
      if (!existingConv) {
        convId = `conv_${Date.now()}`;
        const newConv: Conversation = {
          id: convId,
          participantId: app.workerId,
          participantName: app.workerName,
          participantAvatar: app.workerAvatar,
          participantRole: 'worker',
          eventId: app.eventId,
          eventTitle: app.eventTitle,
          lastMessage: `🎉 Application Accepted! Direct shift chat unlocked.`,
          lastMessageTime: 'Just now',
          unreadCount: 1
        };
        setDoc(doc(db, 'conversations', convId), newConv).catch(console.error);
      }

      if (convId) {
        const welcomeMsg: ChatMessage = {
          id: `msg_${Date.now()}`,
          conversationId: convId,
          senderId: app.organizerId,
          senderName: app.organizerName,
          senderRole: 'organizer',
          recipientId: app.workerId,
          message: `🎉 Application Accepted! Welcome to the crew for "${app.eventTitle}" (${app.jobRoleTitle}). Direct shift messaging is now active. Please coordinate shift details, arrival time, and dress code here.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          eventId: app.eventId
        };
        setDoc(doc(db, 'messages', welcomeMsg.id), welcomeMsg).catch(console.error);
      }
    }

    updateDoc(doc(db, 'applications', applicationId), updates).catch(console.error);

    // Send notification to worker
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: app.workerId,
      title: status === 'accepted' ? 'Application Accepted! 🎉' : 'Application Update ℹ️',
      message: status === 'accepted' 
        ? `Your application for ${app.jobRoleTitle} on "${app.eventTitle}" was ACCEPTED! Direct chat is now unlocked.` 
        : `Your application status for "${app.eventTitle}" was updated to ${status}.`,
      type: 'application',
      read: false,
      date: 'Just now'
    };
    setDoc(doc(db, 'notifications', notif.id), notif).catch(console.error);
  };

  const startOrGetConversation = (arg1: string, arg2?: string, arg3?: string): string => {
    let targetUserId: string;
    let eventId: string | undefined;

    if (arg3) {
      // Called with legacy (workerId, organizerId, eventId)
      targetUserId = currentUser.id === arg1 ? arg2! : arg1;
      eventId = arg3;
    } else {
      // Called with (targetUserId, eventId)
      targetUserId = arg1;
      eventId = arg2;
    }

    // Look for an existing conversation thread between currentUser and targetUser
    const existing = conversations.find(c => 
      !c.isGroup && (
        (c.participantIds && c.participantIds.includes(targetUserId) && c.participantIds.includes(currentUser.id)) ||
        (c.participantId === targetUserId) ||
        (eventId && c.eventId === eventId && (c.participantId === targetUserId || (c.participantIds && c.participantIds.includes(targetUserId))))
      )
    );

    if (existing) {
      return existing.id;
    }

    const targetUser = users.find(u => u.id === targetUserId);
    const targetEvent = eventId ? events.find(e => e.id === eventId) : events[0];
    const isTargetOrganizer = targetUser?.role === 'organizer';
    const isTargetWorker = targetUser?.role === 'worker';
    const convType = isTargetOrganizer ? 'organizer' : (isTargetWorker ? 'coworker' : 'organizer');

    const targetRoleTitle = isTargetOrganizer 
      ? 'Event Host & Producer'
      : (targetUser?.skills?.[0] ? `${targetUser.skills[0]} Specialist (Co-Worker)` : 'Shift Co-Worker');

    const convId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: convId,
      participantId: targetUserId,
      participantName: targetUser?.name || (isTargetOrganizer ? 'Event Organizer' : 'Crew Co-Worker'),
      participantAvatar: targetUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      participantRole: targetUser?.role || 'worker',
      participantIds: [currentUser.id, targetUserId],
      conversationType: convType,
      targetRoleTitle,
      eventId: targetEvent?.id,
      eventTitle: targetEvent?.title || 'Event Shift',
      lastMessage: '🎉 Shift Chat Active',
      lastMessageTime: 'Just now',
      unreadCount: 0
    };

    setDoc(doc(db, 'conversations', convId), newConv).catch(console.error);

    const initMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId: targetUserId,
      message: isTargetOrganizer
        ? `Hello! Ready for our upcoming shift on "${targetEvent?.title || 'the event'}". Please let me know any specific briefing instructions or arrival notes.`
        : `Hi ${targetUser?.name ? targetUser.name.split(' ')[0] : 'there'}! Reaching out as fellow crew for "${targetEvent?.title || 'the shift'}". Let's coordinate shift duties and handoffs!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventId: targetEvent?.id
    };
    setDoc(doc(db, 'messages', initMsg.id), initMsg).catch(console.error);

    return convId;
  };

  const sendMessage = (recipientId: string, conversationId: string, messageText: string, eventId?: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId,
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventId
    };

    setDoc(doc(db, 'messages', newMsg.id), newMsg).catch(console.error);

    // Update conversation last message in Firestore
    const convDoc = conversations.find(c => c.id === conversationId);
    if (convDoc) {
      updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: messageText,
        lastMessageTime: 'Just now'
      }).catch(console.error);
    }
  };

  const releasePayout = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app || app.payoutStatus === 'released') return;

    // Update application payout status in Firestore
    updateDoc(doc(db, 'applications', applicationId), {
      payoutStatus: 'released',
      status: 'completed'
    }).catch(console.error);

    // Transfer funds to worker wallet in Firestore
    const worker = users.find(u => u.id === app.workerId);
    if (worker) {
      updateDoc(doc(db, 'users', app.workerId), {
        walletBalance: (worker.walletBalance || 0) + app.payAmount
      }).catch(console.error);
    }

    // Add transaction logs to Firestore
    const workerTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: app.workerId,
      type: 'payout_received',
      amount: app.payAmount,
      status: 'completed',
      description: `Payout received for ${app.jobRoleTitle} - ${app.eventTitle}`,
      date: new Date().toISOString().split('T')[0],
      eventId: app.eventId,
      eventTitle: app.eventTitle
    };
    setDoc(doc(db, 'transactions', workerTx.id), workerTx).catch(console.error);

    // Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: app.workerId,
      title: 'Payment Released! 💰',
      message: `You received ₹${app.payAmount.toLocaleString('en-IN')} for completing your shift on "${app.eventTitle}".`,
      type: 'payment',
      read: false,
      date: 'Just now'
    };
    setDoc(doc(db, 'notifications', notif.id), notif).catch(console.error);
  };

  const postReview = (eventId: string, eventTitle: string, targetId: string, targetName: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      eventId,
      eventTitle,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerRole: currentUser.role,
      reviewerAvatar: currentUser.avatar,
      targetId,
      targetName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    setDoc(doc(db, 'reviews', newRev.id), newRev).catch(console.error);
  };

  const markNotificationRead = (notifId: string) => {
    updateDoc(doc(db, 'notifications', notifId), { read: true }).catch(console.error);
  };

  const resolveComplaint = (complaintId: string, resolution: string) => {
    updateDoc(doc(db, 'complaints', complaintId), { status: 'resolved', resolution }).catch(console.error);
  };

  const addFundsToWallet = (amount: number) => {
    const newBalance = currentUser.walletBalance + amount;
    setCurrentUser(prev => ({ ...prev, walletBalance: newBalance }));
    updateDoc(doc(db, 'users', currentUser.id), { walletBalance: newBalance }).catch(console.error);

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      type: 'deposit',
      amount,
      status: 'completed',
      description: 'Wallet top-up deposit',
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [tx, ...prev]);
    setDoc(doc(db, 'transactions', tx.id), tx).catch(console.error);
  };

  const withdrawFundsFromWallet = (
    amount: number,
    details: {
      method: 'bank' | 'upi';
      bankDetails?: {
        accountHolder: string;
        bankName: string;
        accountNumber: string;
        ifsc: string;
        accountType: string;
      };
      upiDetails?: {
        upiId: string;
        accountHolder: string;
        provider: string;
      };
    }
  ): { success: boolean; error?: string } => {
    // Validate withdrawal based on role minimum balance maintenance rules
    // (Workers: ₹1,000 INR min balance; Organizers: ₹5,000 INR min balance)
    const validation = validateWithdrawal(currentUser.walletBalance, amount, currentUser.role);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    const newBalance = Math.max(0, currentUser.walletBalance - amount);
    setCurrentUser(prev => ({ ...prev, walletBalance: newBalance }));
    updateDoc(doc(db, 'users', currentUser.id), { walletBalance: newBalance }).catch(console.error);

    const description = details.method === 'upi'
      ? `Withdrawal via UPI (${details.upiDetails?.upiId || 'VPA'})`
      : `Bank Transfer to ${details.bankDetails?.bankName || 'Bank'} (A/C ••••${details.bankDetails?.accountNumber?.slice(-4) || ''})`;

    const tx: Transaction = {
      id: `tx_wd_${Date.now()}`,
      userId: currentUser.id,
      type: 'withdrawal',
      amount,
      status: 'completed',
      description,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [tx, ...prev]);
    setDoc(doc(db, 'transactions', tx.id), tx).catch(console.error);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'Withdrawal Processed',
      message: `₹${amount.toLocaleString('en-IN')} has been withdrawn to your ${details.method === 'upi' ? 'UPI VPA' : 'Bank Account'}.`,
      type: 'payment',
      read: false,
      date: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);
    setDoc(doc(db, 'notifications', notif.id), notif).catch(console.error);

    return { success: true };
  };

  const createGroupChat = (eventId: string, eventTitle: string, participantIds: string[]): string => {
    const existing = conversations.find(c => c.isGroup && c.eventId === eventId);
    if (existing) return existing.id;

    const convId = `group_${Date.now()}`;
    const newGroup: Conversation = {
      id: convId,
      participantId: 'crew_group',
      participantName: `${eventTitle} Crew Group`,
      participantAvatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=80',
      participantRole: 'organizer',
      eventId,
      eventTitle,
      lastMessage: '🎉 Event Crew Group Created! Coordinate shifts here.',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      isGroup: true,
      groupName: `${eventTitle} Crew`,
      memberCount: participantIds.length,
      memberIds: participantIds
    };
    setDoc(doc(db, 'conversations', convId), newGroup).catch(console.error);

    const initMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId: 'all',
      message: `Welcome to the crew group chat for "${eventTitle}"! All accepted shift staff and organizers can communicate shift logistics here.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventId
    };
    setDoc(doc(db, 'messages', initMsg.id), initMsg).catch(console.error);
    return convId;
  };

  const fileDispute = (disputeData: Omit<Dispute, 'id' | 'createdAt' | 'status'>) => {
    const newDispute: Dispute = {
      ...disputeData,
      id: `disp_${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDoc(doc(db, 'disputes', newDispute.id), newDispute).catch(console.error);

    // Notify opposing party and admin
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: disputeData.againstId,
      title: 'Dispute Filed ⚠️',
      message: `${disputeData.raisedByName} filed a dispute regarding "${disputeData.eventTitle}". Platform Admin mediation is now active.`,
      type: 'dispute',
      read: false,
      date: 'Just now'
    };
    setDoc(doc(db, 'notifications', notif.id), notif).catch(console.error);
  };

  const resolveDispute = (
    disputeId: string, 
    resolution: 'resolved_worker' | 'resolved_organizer' | 'resolved_split', 
    notes: string
  ) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    updateDoc(doc(db, 'disputes', disputeId), {
      status: resolution,
      resolutionNotes: notes,
      resolvedAt: new Date().toISOString().split('T')[0]
    }).catch(console.error);

    // Adjust financial balances based on resolution
    const workerId = dispute.raisedByRole === 'worker' ? dispute.raisedById : dispute.againstId;
    const organizerId = dispute.raisedByRole === 'organizer' ? dispute.raisedById : dispute.againstId;
    const worker = users.find(u => u.id === workerId);
    const organizer = users.find(u => u.id === organizerId);

    if (resolution === 'resolved_worker') {
      // Release full disputed amount to worker
      if (worker) {
        updateDoc(doc(db, 'users', workerId), {
          walletBalance: (worker.walletBalance || 0) + dispute.amountDisputed
        }).catch(console.error);
      }
    } else if (resolution === 'resolved_organizer') {
      // Refund to organizer
      if (organizer) {
        updateDoc(doc(db, 'users', organizerId), {
          walletBalance: (organizer.walletBalance || 0) + dispute.amountDisputed
        }).catch(console.error);
      }
    } else if (resolution === 'resolved_split') {
      // 50/50 split
      const half = Math.round(dispute.amountDisputed / 2);
      if (worker) {
        updateDoc(doc(db, 'users', workerId), {
          walletBalance: (worker.walletBalance || 0) + half
        }).catch(console.error);
      }
      if (organizer) {
        updateDoc(doc(db, 'users', organizerId), {
          walletBalance: (organizer.walletBalance || 0) + half
        }).catch(console.error);
      }
    }

    // Notify both parties
    [dispute.raisedById, dispute.againstId].forEach(uid => {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}_${uid}`,
        userId: uid,
        title: 'Dispute Resolved ⚖️',
        message: `Dispute on "${dispute.eventTitle}" was settled: ${resolution.replace('_', ' ').toUpperCase()}. Admin notes: ${notes}`,
        type: 'dispute',
        read: false,
        date: 'Just now'
      };
      setDoc(doc(db, 'notifications', notif.id), notif).catch(console.error);
    });
  };

  const generateInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>): Invoice => {
    const prefix = invoiceData.type === 'organizer_bill' ? 'INV-EC' : 'RCPT-WRK';
    const num = Math.floor(1000 + Math.random() * 9000);
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      invoiceNumber: `${prefix}-${new Date().getFullYear()}-${num}`,
      date: new Date().toISOString().split('T')[0]
    };
    setDoc(doc(db, 'invoices', newInvoice.id), newInvoice).catch(console.error);
    return newInvoice;
  };

  const submitIdentityVerification = (docType: string, docNumber: string) => {
    const verificationDoc = {
      type: docType,
      idNumber: docNumber,
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setCurrentUser(prev => ({
      ...prev,
      verificationStatus: 'pending',
      verificationDoc
    }));
    updateDoc(doc(db, 'users', currentUser.id), {
      verificationStatus: 'pending',
      verificationDoc
    }).catch(console.error);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'ID Verification Submitted 🛡️',
      message: `Your ${docType} has been submitted for verification. Admin review is underway.`,
      type: 'system',
      read: false,
      date: 'Just now'
    };
    setDoc(doc(db, 'notifications', notif.id), notif).catch(console.error);
  };

  const verifyUserIdentity = (userId: string, status: 'verified' | 'unverified') => {
    updateDoc(doc(db, 'users', userId), {
      isVerified: status === 'verified',
      verificationStatus: status
    }).catch(console.error);

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        isVerified: status === 'verified',
        verificationStatus: status
      }));
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId,
      title: status === 'verified' ? 'Identity Verified! 🛡️' : 'Verification Update',
      message: status === 'verified' 
        ? 'Congratulations! Your government ID has been approved. The Verified Badge is now active on your profile.'
        : 'Your ID verification status has been updated.',
      type: 'system',
      read: false,
      date: 'Just now'
    };
    setDoc(doc(db, 'notifications', notif.id), notif).catch(console.error);
  };

  const toggle2FA = (enable: boolean) => {
    setCurrentUser(prev => ({ ...prev, twoFactorEnabled: enable }));
    updateDoc(doc(db, 'users', currentUser.id), { twoFactorEnabled: enable }).catch(console.error);
  };

  const updateSubscription = (tier: 'starter' | 'pro' | 'enterprise') => {
    const feeMap = { starter: 0, pro: 1999, enterprise: 4999 };
    const cost = feeMap[tier];
    const newBalance = Math.max(0, currentUser.walletBalance - cost);

    setCurrentUser(prev => ({ ...prev, subscriptionTier: tier, walletBalance: newBalance }));
    updateDoc(doc(db, 'users', currentUser.id), { 
      subscriptionTier: tier,
      walletBalance: newBalance
    }).catch(console.error);

    if (cost > 0) {
      const tx: Transaction = {
        id: `tx_${Date.now()}`,
        userId: currentUser.id,
        type: 'subscription',
        amount: cost,
        status: 'completed',
        description: `Upgrade to ${tier.toUpperCase()} Organizer Subscription`,
        date: new Date().toISOString().split('T')[0]
      };
      setDoc(doc(db, 'transactions', tx.id), tx).catch(console.error);
    }
  };

  const toggleAvailability = (dateStr: string, status: 'available' | 'busy') => {
    const currentAvail = currentUser.availability || {};
    const updated = { ...currentAvail, [dateStr]: status };
    setCurrentUser(prev => ({ ...prev, availability: updated }));
    updateDoc(doc(db, 'users', currentUser.id), { availability: updated }).catch(console.error);
  };

  const toggleOfflineMode = () => {
    setIsOffline(prev => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        users,
        events,
        applications,
        conversations,
        messages,
        transactions,
        reviews,
        notifications,
        complaints,
        disputes,
        invoices,
        isOffline,
        toggleOfflineMode,
        darkMode,
        toggleDarkMode,
        colorTheme,
        setColorTheme,
        switchRole,
        loginUser,
        logoutUser,
        signupUser,
        createEvent,
        updateEventStatus,
        applyForJob,
        updateApplicationStatus,
        startOrGetConversation,
        createGroupChat,
        sendMessage,
        releasePayout,
        postReview,
        markNotificationRead,
        resolveComplaint,
        addFundsToWallet,
        withdrawFundsFromWallet,
        minRequiredWalletBalance: getMinimumWalletBalance(currentUser.role),
        isWalletBalanceCompliant: isWalletBalanceMaintained(currentUser.walletBalance, currentUser.role),
        fileDispute,
        resolveDispute,
        generateInvoice,
        submitIdentityVerification,
        verifyUserIdentity,
        toggle2FA,
        updateSubscription,
        toggleAvailability
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

