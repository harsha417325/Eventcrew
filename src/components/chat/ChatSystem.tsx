import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  UsersRound, 
  Users,
  Building2,
  Navigation,
  Search,
  CheckCheck,
  Briefcase,
  Radio,
  Clock,
  Sparkles,
  Mic,
  MicOff,
  AlertCircle,
  X,
  Volume2
} from 'lucide-react';
import { VenueMapModal } from '../events/VenueMapModal';
import { Conversation, User } from '../../types';

interface ChatSystemProps {
  initialWorkerId?: string;
  initialEventId?: string;
  initialChatId?: string;
}

type FilterTab = 'all' | 'organizers' | 'coworkers' | 'crew';

export const ChatSystem: React.FC<ChatSystemProps> = ({ 
  initialWorkerId, 
  initialEventId, 
  initialChatId 
}) => {
  const { 
    currentUser, 
    conversations, 
    messages, 
    sendMessage, 
    applications, 
    events, 
    users, 
    startOrGetConversation,
    createGroupChat 
  } = useAuth();

  const [activeConvId, setActiveConvId] = useState<string>(
    initialChatId || conversations[0]?.id || ''
  );
  const [inputMessage, setInputMessage] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickConnect, setShowQuickConnect] = useState(false);
  const [showVenueMap, setShowVenueMap] = useState(false);

  // Speech-to-Text state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = React.useRef<any>(null);
  const baseInputRef = React.useRef<string>('');

  // Check Web Speech API availability
  const isSpeechSupported = useMemo(() => {
    return typeof window !== 'undefined' && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const startListening = () => {
    setSpeechError(null);
    const SpeechRecognition = typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    
    if (!SpeechRecognition) {
      setSpeechError('Speech Recognition is not supported by your current browser. You can use Chrome, Edge, or Safari, or use quick pings below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      // Record baseline text so speech input appends cleanly
      baseInputRef.current = inputMessage;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalChunk += item[0].transcript;
          } else {
            interimChunk += item[0].transcript;
          }
        }

        setInterimTranscript(interimChunk);

        const currentBase = baseInputRef.current.trim();
        const separator = currentBase.length > 0 ? ' ' : '';

        if (finalChunk.trim()) {
          const updated = `${currentBase}${separator}${finalChunk.trim()}`;
          baseInputRef.current = updated;
          setInputMessage(updated);
          setInterimTranscript('');
        } else if (interimChunk.trim()) {
          setInputMessage(`${currentBase}${separator}${interimChunk.trim()}`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser to use voice typing.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Keep waiting for speech
        } else if (event.error === 'aborted') {
          setIsListening(false);
        } else {
          setSpeechError(`Speech recognition message: ${event.error}. Click mic to retry.`);
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition start failed:', err);
      setSpeechError('Could not start speech recognition. Please verify microphone permissions.');
      setIsListening(false);
    }
  };

  const toggleSpeechToText = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Clean up speech recognition on conversation switch or unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [activeConvId]);

  // Sync with initial props
  useEffect(() => {
    if (initialChatId) {
      setActiveConvId(initialChatId);
    } else if (initialWorkerId || initialEventId) {
      const match = conversations.find(
        c => (!initialEventId || c.eventId === initialEventId) && 
             (c.participantId === initialWorkerId || 
              (c.participantIds && c.participantIds.includes(initialWorkerId!)))
      ) || conversations.find(c => c.eventId === initialEventId || c.participantId === initialWorkerId);
      
      if (match) {
        setActiveConvId(match.id);
      } else if (initialWorkerId) {
        const newId = startOrGetConversation(initialWorkerId, initialEventId);
        setActiveConvId(newId);
      }
    } else if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [initialWorkerId, initialEventId, initialChatId, conversations]);

  // Helper to resolve dynamic display info for any conversation
  const getConvMetadata = (conv: Conversation) => {
    if (conv.isGroup) {
      return {
        id: conv.id,
        name: conv.groupName || `${conv.eventTitle || 'Event'} Crew Channel`,
        avatar: conv.participantAvatar || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=80',
        roleType: 'crew' as const,
        roleBadge: 'Crew Channel',
        roleDescription: `Shift Team Broadcast (${conv.memberCount || 4} crew members)`,
        targetUserId: 'all',
        isOnline: true
      };
    }

    // Check participant IDs or participantId
    let otherUserId = conv.participantId;
    if (conv.participantIds && conv.participantIds.length > 0) {
      const found = conv.participantIds.find(id => id !== currentUser.id);
      if (found) otherUserId = found;
    }

    const otherUser = users.find(u => u.id === otherUserId);
    const isOrganizer = otherUser?.role === 'organizer' || conv.participantRole === 'organizer';
    const roleType: 'organizer' | 'coworker' = isOrganizer ? 'organizer' : 'coworker';

    const name = otherUser?.name || conv.participantName;
    const avatar = otherUser?.avatar || conv.participantAvatar;
    const roleBadge = isOrganizer ? 'Organizer' : 'Co-Worker';
    const roleDescription = isOrganizer 
      ? 'Event Host & Producer'
      : (otherUser?.skills?.[0] ? `${otherUser.skills[0]} Specialist` : 'Shift Co-Worker');

    return {
      id: conv.id,
      name,
      avatar,
      roleType,
      roleBadge,
      roleDescription,
      targetUserId: otherUserId,
      phone: otherUser?.phone || '+91 98765 43210',
      isOnline: true
    };
  };

  // Filtered conversation list
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const meta = getConvMetadata(conv);

      // Tab filter
      if (filterTab === 'organizers' && meta.roleType !== 'organizer') return false;
      if (filterTab === 'coworkers' && meta.roleType !== 'coworker') return false;
      if (filterTab === 'crew' && meta.roleType !== 'crew') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = meta.name.toLowerCase().includes(q);
        const matchesEvent = (conv.eventTitle || '').toLowerCase().includes(q);
        const matchesMsg = (conv.lastMessage || '').toLowerCase().includes(q);
        return matchesName || matchesEvent || matchesMsg;
      }

      return true;
    });
  }, [conversations, filterTab, searchQuery, users, currentUser]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeMeta = activeConv ? getConvMetadata(activeConv) : null;
  const activeMessages = messages.filter(m => m.conversationId === (activeConv?.id || activeConvId));

  // Current event
  const currentEvent = activeConv ? events.find(e => e.id === activeConv.eventId) : null;

  // Build list of all potential organizers and co-workers from user's accepted events for Quick Connect
  const connectedContacts = useMemo(() => {
    const contacts: {
      user: User;
      type: 'organizer' | 'coworker';
      eventTitle: string;
      eventId: string;
      roleTitle: string;
    }[] = [];

    // Find all events where currentUser is accepted
    const myAcceptedEvents = applications
      .filter(a => a.workerId === currentUser.id && (a.status === 'accepted' || a.status === 'completed'))
      .map(a => a.eventId);

    const uniqueEventIds = Array.from(new Set(myAcceptedEvents));

    uniqueEventIds.forEach(evId => {
      const ev = events.find(e => e.id === evId);
      if (!ev) return;

      // Add organizer
      const organizer = users.find(u => u.id === ev.organizerId);
      if (organizer && !contacts.some(c => c.user.id === organizer.id && c.eventId === evId)) {
        contacts.push({
          user: organizer,
          type: 'organizer',
          eventTitle: ev.title,
          eventId: ev.id,
          roleTitle: 'Event Host & Producer'
        });
      }

      // Add co-workers (other accepted workers on same event)
      const coworkerApps = applications.filter(
        a => a.eventId === evId && a.workerId !== currentUser.id && (a.status === 'accepted' || a.status === 'completed')
      );

      coworkerApps.forEach(app => {
        const coworkerUser = users.find(u => u.id === app.workerId);
        if (coworkerUser && !contacts.some(c => c.user.id === coworkerUser.id && c.eventId === evId)) {
          contacts.push({
            user: coworkerUser,
            type: 'coworker',
            eventTitle: ev.title,
            eventId: ev.id,
            roleTitle: app.jobRoleTitle
          });
        }
      });
    });

    // Fallback: If no accepted events yet, show seed contacts so worker can immediately test
    if (contacts.length === 0) {
      const seedOrg = users.find(u => u.role === 'organizer');
      const seedCoworker = users.find(u => u.role === 'worker' && u.id !== currentUser.id);
      const seedEvent = events[0];

      if (seedOrg) {
        contacts.push({
          user: seedOrg,
          type: 'organizer',
          eventTitle: seedEvent?.title || 'India Tech Summit Gala Night',
          eventId: seedEvent?.id || 'evt_1',
          roleTitle: 'Event Producer'
        });
      }
      if (seedCoworker) {
        contacts.push({
          user: seedCoworker,
          type: 'coworker',
          eventTitle: seedEvent?.title || 'India Tech Summit Gala Night',
          eventId: seedEvent?.id || 'evt_1',
          roleTitle: 'Event Photographer'
        });
      }
    }

    return contacts;
  }, [applications, currentUser, events, users]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    }
    const messageToSend = inputMessage.trim();
    if (!messageToSend || !activeConv || !activeMeta) return;

    sendMessage(activeMeta.targetUserId, activeConv.id, messageToSend, activeConv.eventId);
    setInputMessage('');
    baseInputRef.current = '';
    setInterimTranscript('');
  };

  const handleQuickSend = (text: string) => {
    if (!activeConv || !activeMeta) return;
    sendMessage(activeMeta.targetUserId, activeConv.id, text, activeConv.eventId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Notification / Capability Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Radio className="w-5 h-5 animate-pulse text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Worker Shift Comms Hub
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Mic className="w-2.5 h-2.5" /> Speech-to-Text
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live & Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Communicate directly with your event organizers and shift co-workers via instant messaging, speech-to-text voice typing, and shift channels.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowQuickConnect(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>Connect with Crew</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left Conversation List Panel */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3 flex flex-col">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search chats, contacts, gigs..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-[11px] font-semibold">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab('organizers')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                filterTab === 'organizers'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" /> Organizers
            </button>
            <button
              onClick={() => setFilterTab('coworkers')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                filterTab === 'coworkers'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" /> Co-Workers
            </button>
            <button
              onClick={() => setFilterTab('crew')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                filterTab === 'crew'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UsersRound className="w-3 h-3" /> Crew
            </button>
          </div>

          {/* Conversation List */}
          <div className="space-y-2 overflow-y-auto max-h-[520px] flex-1 pr-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No threads found in this category.</p>
                <button
                  onClick={() => setShowQuickConnect(true)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Start a thread with your crew
                </button>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = conv.id === activeConvId;
                const meta = getConvMetadata(conv);

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-1 ring-indigo-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={meta.avatar}
                          alt={meta.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-white/30"
                        />
                        {/* Status Icon */}
                        {meta.roleType === 'crew' ? (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                            <UsersRound className="w-2.5 h-2.5" />
                          </span>
                        ) : meta.roleType === 'organizer' ? (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                            <Building2 className="w-2.5 h-2.5" />
                          </span>
                        ) : (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                            <Users className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-1">
                          <h4 className="font-bold text-xs truncate flex items-center gap-1">
                            {meta.name}
                          </h4>
                          <span className={`text-[10px] shrink-0 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        {/* Role pill and Event */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : meta.roleType === 'organizer'
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                              : meta.roleType === 'coworker'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {meta.roleBadge}
                          </span>
                          <span className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                            {conv.eventTitle}
                          </span>
                        </div>

                        <p className={`text-[11px] truncate mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-300'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Thread */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white dark:bg-slate-800 min-h-[580px]">
          
          {activeConv && activeMeta ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/30">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeMeta.avatar}
                      alt={activeMeta.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        {activeMeta.name}
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        activeMeta.roleType === 'organizer'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : activeMeta.roleType === 'coworker'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {activeMeta.roleBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeMeta.roleDescription} • <span className="font-semibold text-slate-700 dark:text-slate-300">{activeConv.eventTitle}</span>
                    </p>
                  </div>
                </div>

                {/* Navigation Action Buttons */}
                <div className="flex items-center gap-2">
                  {currentEvent && (
                    <button
                      onClick={() => setShowVenueMap(true)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="View Venue Map & Transit Directions"
                    >
                      <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="hidden sm:inline">Venue Map</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Context Banner */}
              <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
                activeMeta.roleType === 'organizer'
                  ? 'bg-indigo-50/80 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200 border-indigo-100 dark:border-indigo-900/40'
                  : activeMeta.roleType === 'coworker'
                  ? 'bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border-emerald-100 dark:border-emerald-900/40'
                  : 'bg-amber-50/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border-amber-100 dark:border-amber-900/40'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {activeMeta.roleType === 'organizer'
                      ? 'Direct communication with your event organizer. Confirm shifts, uniform guidelines, and briefing times.'
                      : activeMeta.roleType === 'coworker'
                      ? 'Co-worker channel. Coordinate shift handoffs, station relief, arrival sync, and shared tasks.'
                      : 'Event crew channel. All accepted co-workers and the event organizer participate here.'}
                  </span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[380px] flex-1">
                {activeMessages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <p className="text-xs">No messages yet. Send a greeting to start coordinating!</p>
                  </div>
                ) : (
                  activeMessages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    const isOrg = msg.senderRole === 'organizer';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {isMe ? 'You' : msg.senderName}
                          </span>
                          {!isMe && (
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                              isOrg
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}>
                              {isOrg ? 'Organizer' : 'Co-Worker'}
                            </span>
                          )}
                        </div>

                        <div className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none'
                        }`}>
                          {msg.message}
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Shift Chips */}
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-semibold shrink-0">Quick Pings:</span>
                {activeMeta.roleType === 'organizer' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleQuickSend('📍 I have arrived at the venue check-in area.')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      📍 Arrived at venue
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSend('👔 In required dress code and ready for briefing.')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      👔 Uniform check ready
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSend('🥪 On 15-minute scheduled break. Station covered.')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      🥪 Break status
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSend('🏁 Shift completed successfully! Ready for checkout.')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      🏁 Shift completed
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleQuickSend('👋 Hey! Where are you located on site right now?')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      👋 Where are you on site?
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSend('📍 I just reached the crew briefing room.')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      📍 Reached crew room
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSend('🥪 Ready for our break rotation whenever you need!')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      🥪 Break rotation sync
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSend('⚡ Need a quick 2-minute handoff at my post.')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                    >
                      ⚡ Quick station handoff
                    </button>
                  </>
                )}
              </div>

              {/* Active Speech-to-Text Listening Banner */}
              {isListening && (
                <div className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/50 border-t border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                    </span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-rose-700 dark:text-rose-300 shrink-0 flex items-center gap-1">
                        <Mic className="w-3.5 h-3.5 animate-pulse" /> Listening...
                      </span>
                      {/* Audio frequency wave visualizer */}
                      <div className="flex items-end gap-0.5 h-3 px-1 shrink-0">
                        <span className="w-1 bg-rose-500 rounded-full animate-pulse h-3"></span>
                        <span className="w-1 bg-rose-500 rounded-full animate-pulse h-1.5"></span>
                        <span className="w-1 bg-rose-500 rounded-full animate-pulse h-3.5"></span>
                        <span className="w-1 bg-rose-500 rounded-full animate-pulse h-2"></span>
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 truncate italic font-medium">
                        {interimTranscript ? `"${interimTranscript}"` : 'Speak clearly into your microphone...'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={stopListening}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-semibold text-[11px] transition-all shadow-xs"
                    >
                      Done Speaking
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        stopListening();
                        setInputMessage(baseInputRef.current);
                        setInterimTranscript('');
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/30"
                      title="Cancel voice input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Speech Error Banner */}
              {speechError && (
                <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span className="truncate">{speechError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSpeechError(null)}
                    className="p-1 text-amber-600 hover:text-amber-800 ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Message Input Form */}
              <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={e => {
                      setInputMessage(e.target.value);
                      baseInputRef.current = e.target.value;
                    }}
                    placeholder={
                      isListening
                        ? 'Listening to speech... Speak now...'
                        : `Message ${activeMeta.name} (${activeMeta.roleBadge})...`
                    }
                    className={`w-full bg-slate-100 dark:bg-slate-900 border rounded-2xl pl-4 pr-12 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none transition-all ${
                      isListening
                        ? 'border-rose-400 dark:border-rose-500 ring-2 ring-rose-300/60 dark:ring-rose-900/60'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                  {/* Inline Speech-to-Text Mic Button inside input */}
                  <button
                    type="button"
                    onClick={toggleSpeechToText}
                    className={`absolute right-2 p-2 rounded-xl transition-all flex items-center justify-center ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                        : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                    title={
                      isListening
                        ? 'Stop speech-to-text'
                        : isSpeechSupported
                        ? 'Voice Typing: Click to speak (Speech-to-Text)'
                        : 'Speech-to-Text (Click to activate voice typing)'
                    }
                    aria-label="Speech to text"
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-white" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() && !isListening}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 ${
                    inputMessage.trim() || isListening
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm my-auto space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <p>Select a message thread or connect with a co-worker or organizer.</p>
              <button
                onClick={() => setShowQuickConnect(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Connect with Crew
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Quick Connect / Crew Selector Modal */}
      {showQuickConnect && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Select Crew Member or Organizer
                </h3>
                <p className="text-xs text-slate-500">
                  Direct message with confirmed event staff and organizers.
                </p>
              </div>
              <button
                onClick={() => setShowQuickConnect(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {connectedContacts.map(contact => (
                <div
                  key={`${contact.user.id}_${contact.eventId}`}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={contact.user.avatar}
                      alt={contact.user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {contact.user.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          contact.type === 'organizer'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {contact.type === 'organizer' ? 'Organizer' : 'Co-Worker'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {contact.roleTitle} • <span className="text-slate-700 dark:text-slate-200 font-semibold">{contact.eventTitle}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setShowQuickConnect(false);
                        const convId = startOrGetConversation(contact.user.id, contact.eventId);
                        setActiveConvId(convId);
                      }}
                      className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      title="Send Message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Venue Transit Map Modal */}
      {showVenueMap && currentEvent && (
        <VenueMapModal
          event={currentEvent}
          onClose={() => setShowVenueMap(false)}
        />
      )}

    </div>
  );
};
