import { User, EventItem, JobApplication, ChatMessage, Conversation, Transaction, Review, NotificationItem, Complaint, Dispute, Invoice } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'org_1',
    name: 'Apex Events Co.',
    email: 'organizer@apexevents.com',
    role: 'organizer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    bio: 'Premier corporate and luxury wedding production company in Mumbai & Pune.',
    rating: 4.9,
    reviewCount: 38,
    walletBalance: 48500,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDoc: {
      type: 'Certificate of Incorporation & GSTIN',
      idNumber: '27AABCA1234F1Z8',
      submittedAt: '2025-01-20'
    },
    twoFactorEnabled: true,
    subscriptionTier: 'pro',
    badges: ['Super Organizer', 'Instant Payer', 'Verified Host'],
    status: 'active',
    createdAt: '2025-01-15'
  },
  {
    id: 'org_2',
    name: 'Vibrant Gala Productions',
    email: 'contact@vibrantgala.com',
    role: 'organizer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '+91 98123 45678',
    city: 'Bengaluru',
    bio: 'High energy gala, expo and festival planning agency based in Bengaluru & Delhi.',
    rating: 4.8,
    reviewCount: 29,
    walletBalance: 32000,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDoc: {
      type: 'GSTIN Registration',
      idNumber: '29ABCDE6789G2Z4',
      submittedAt: '2025-02-05'
    },
    twoFactorEnabled: false,
    subscriptionTier: 'starter',
    badges: ['Verified Host'],
    status: 'active',
    createdAt: '2025-02-01'
  },
  {
    id: 'wrk_1',
    name: 'Ananya Sharma',
    email: 'ananya.worker@eventcrew.com',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    phone: '+91 97654 32109',
    city: 'Mumbai',
    skills: ['Catering', 'Hosting', 'Decoration'],
    experience: '4 years of premium banquets & VIP hosting experience.',
    hourlyRate: 450,
    bio: 'Punctual, friendly, and experienced lead server & VIP host for tech expos & weddings.',
    rating: 4.9,
    reviewCount: 24,
    walletBalance: 9800,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDoc: {
      type: 'Aadhaar Card',
      idNumber: '•••• •••• 9214',
      submittedAt: '2025-02-12'
    },
    twoFactorEnabled: true,
    badges: ['Top Rated Crew', 'Punctuality Star', '50+ Shifts Completed', 'Verified Pro'],
    xpPoints: 850,
    availability: {
      '2026-08-20': 'busy',
      '2026-08-21': 'available',
      '2026-08-22': 'available',
      '2026-08-23': 'busy',
      '2026-08-24': 'available'
    },
    status: 'active',
    createdAt: '2025-02-10'
  },
  {
    id: 'wrk_2',
    name: 'Rohan Verma',
    email: 'rohan.verma@eventcrew.com',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    phone: '+91 98760 12345',
    city: 'Mumbai',
    skills: ['Photography', 'Audio & DJ', 'Hosting'],
    experience: '5 years event photography & live sound setup.',
    hourlyRate: 1200,
    bio: 'Professional event photographer with Sony A7IV gear + lighting kit.',
    rating: 5.0,
    reviewCount: 19,
    walletBalance: 14500,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDoc: {
      type: 'Passport',
      idNumber: 'Z••••••8',
      submittedAt: '2025-01-25'
    },
    twoFactorEnabled: false,
    badges: ['Top Rated Crew', 'Photography Ace', 'Verified Pro'],
    xpPoints: 920,
    availability: {
      '2026-08-20': 'available',
      '2026-08-21': 'busy',
      '2026-08-22': 'available'
    },
    status: 'active',
    createdAt: '2025-01-20'
  },
  {
    id: 'wrk_3',
    name: 'Vikram Malhotra',
    email: 'vikram.m@eventcrew.com',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    phone: '+91 99887 76655',
    city: 'Bengaluru',
    skills: ['Security', 'General Helper'],
    experience: '3 years corporate event security guard.',
    hourlyRate: 350,
    bio: 'PSARA licensed security personnel specialized in crowd control.',
    rating: 4.7,
    reviewCount: 15,
    walletBalance: 7200,
    isVerified: true,
    verificationStatus: 'verified',
    verificationDoc: {
      type: 'Driving License',
      idNumber: 'DL-••20210084',
      submittedAt: '2025-02-28'
    },
    twoFactorEnabled: false,
    badges: ['Security Specialist'],
    xpPoints: 620,
    status: 'active',
    createdAt: '2025-02-25'
  },
  {
    id: 'adm_1',
    name: 'EventCrew Security & Ops Admin',
    email: 'admin@eventcrew.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    phone: '+91 80000 00000',
    city: 'Mumbai',
    rating: 5.0,
    reviewCount: 100,
    walletBalance: 250000,
    isVerified: true,
    verificationStatus: 'verified',
    twoFactorEnabled: true,
    status: 'active',
    createdAt: '2025-01-01'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt_1',
    title: 'India Tech Summit Gala Night',
    description: 'Exclusive networking banquet and awards dinner for 400 Tech Executives and VCs at Palace of Fine Arts. We require experienced event staff to manage VIP check-in, serve high-end multi-course meals, setup lighting, and manage stage flow.',
    category: 'Catering',
    city: 'Mumbai',
    venue: 'Taj Lands End, Bandra, Mumbai',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    time: '04:00 PM - 11:30 PM',
    organizerId: 'org_1',
    organizerName: 'Apex Events Co.',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    organizerRating: 4.9,
    status: 'published',
    bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    budgetTotal: 28000,
    rolesNeeded: [
      {
        id: 'role_1_1',
        title: 'VIP Banquet Waiter / Server',
        category: 'Catering',
        quantityNeeded: 6,
        quantityFilled: 4,
        payPerWorker: 2400,
        payType: 'flat',
        shiftHours: 7,
        skillsRequired: ['Fine Dining Service', 'Tray Passing', 'Black Tie Attire'],
        status: 'open'
      },
      {
        id: 'role_1_2',
        title: 'Guest Check-in Host & Concierge',
        category: 'Hosting',
        quantityNeeded: 3,
        quantityFilled: 2,
        payPerWorker: 2100,
        payType: 'flat',
        shiftHours: 6,
        skillsRequired: ['Guest Reception', 'iPad Registration', 'VIP Assistance'],
        status: 'open'
      },
      {
        id: 'role_1_3',
        title: 'Event Photographer & Candid Shooter',
        category: 'Photography',
        quantityNeeded: 2,
        quantityFilled: 1,
        payPerWorker: 3800,
        payType: 'flat',
        shiftHours: 6,
        skillsRequired: ['DSLR/Mirrorless', 'Low Light Flash', 'Corporate Headshots'],
        status: 'open'
      }
    ],
    createdAt: '2026-07-28'
  },
  {
    id: 'evt_2',
    title: 'Rooftop Fashion Expo & Gala',
    description: 'Outdoor rooftop fashion show featuring emerging designers. Needing chic hosts, runway photo crew, floral decoration helpers, and security officers for entrance control.',
    category: 'Hosting',
    city: 'Bengaluru',
    venue: 'UB City, Bengaluru',
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    time: '02:00 PM - 10:00 PM',
    organizerId: 'org_2',
    organizerName: 'Vibrant Gala Productions',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    organizerRating: 4.8,
    status: 'published',
    bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    budgetTotal: 34000,
    rolesNeeded: [
      {
        id: 'role_2_1',
        title: 'Runway Backstage Assistant',
        category: 'Hosting',
        quantityNeeded: 4,
        quantityFilled: 3,
        payPerWorker: 2200,
        payType: 'flat',
        shiftHours: 8,
        skillsRequired: ['Garment Handling', 'Model Cueing', 'Fast Paced'],
        status: 'open'
      },
      {
        id: 'role_2_2',
        title: 'Floral & Backdrop Decorator Helper',
        category: 'Decoration',
        quantityNeeded: 3,
        quantityFilled: 1,
        payPerWorker: 2000,
        payType: 'flat',
        shiftHours: 7,
        skillsRequired: ['Flower Arrangement', 'Lighting Setup', 'Heavy Lifting'],
        status: 'open'
      },
      {
        id: 'role_2_3',
        title: 'Event Security & Access Guard',
        category: 'Security',
        quantityNeeded: 4,
        quantityFilled: 2,
        payPerWorker: 2600,
        payType: 'flat',
        shiftHours: 8,
        skillsRequired: ['Guard License', 'Crowd Control', 'Radio Comms'],
        status: 'open'
      }
    ],
    createdAt: '2026-07-29'
  },
  {
    id: 'evt_3',
    title: 'Music & Food Truck Festival 2026',
    description: '3-day festival with over 15,000 attendees. Hiring dedicated cleanup crew, beverage servers, sound crew, and entrance ticket scanners.',
    category: 'General Helper',
    city: 'Delhi',
    venue: 'Jawaharlal Nehru Stadium, Delhi',
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    time: '11:00 AM - 09:00 PM',
    organizerId: 'org_1',
    organizerName: 'Apex Events Co.',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    organizerRating: 4.9,
    status: 'published',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    budgetTotal: 52000,
    rolesNeeded: [
      {
        id: 'role_3_1',
        title: 'Festival Beverage Server & Cashier',
        category: 'Catering',
        quantityNeeded: 8,
        quantityFilled: 5,
        payPerWorker: 2000,
        payType: 'flat',
        shiftHours: 8,
        skillsRequired: ['TIPS Certified', 'POS Terminal', 'Beverage Pouring'],
        status: 'open'
      },
      {
        id: 'role_3_2',
        title: 'Audio Visual & Stage Sound Technician',
        category: 'Audio & DJ',
        quantityNeeded: 2,
        quantityFilled: 1,
        payPerWorker: 3500,
        payType: 'flat',
        shiftHours: 9,
        skillsRequired: ['Soundboard Operation', 'Microphone Setup', 'Cable Routing'],
        status: 'open'
      },
      {
        id: 'role_3_3',
        title: 'Eco Cleanup & Sanitation Specialist',
        category: 'Cleaning',
        quantityNeeded: 6,
        quantityFilled: 4,
        payPerWorker: 1800,
        payType: 'flat',
        shiftHours: 7,
        skillsRequired: ['Waste Sorting', 'Sanitation', 'Physical Stamina'],
        status: 'open'
      }
    ],
    createdAt: '2026-07-30'
  },
  {
    id: 'evt_4',
    title: 'Healthcare Leadership Annual Convention',
    description: 'National medical conference with 1,200 delegates. Provided registered usher hosts, catering waitstaff, and audio-visual technicians.',
    category: 'Hosting',
    city: 'Hyderabad',
    venue: 'HITEX Exhibition Center, Hyderabad',
    startDate: '2026-07-18',
    endDate: '2026-07-20',
    time: '08:00 AM - 06:00 PM',
    organizerId: 'org_2',
    organizerName: 'Vibrant Gala Productions',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    organizerRating: 4.8,
    status: 'completed',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    budgetTotal: 45000,
    rolesNeeded: [
      {
        id: 'role_4_1',
        title: 'Conference Registration Usher',
        category: 'Hosting',
        quantityNeeded: 5,
        quantityFilled: 5,
        payPerWorker: 2200,
        payType: 'flat',
        shiftHours: 8,
        skillsRequired: ['Badge Printing', 'Guest Reception'],
        status: 'filled'
      }
    ],
    createdAt: '2026-07-01'
  },
  {
    id: 'evt_5',
    title: 'National Wedding & Luxury Living Expo',
    description: '3-day grand wedding exhibition. Complete decoration setup, security detail, and photography coverage executed smoothly.',
    category: 'Decoration',
    city: 'Mumbai',
    venue: 'Jio World Centre, Mumbai',
    startDate: '2026-07-22',
    endDate: '2026-07-24',
    time: '10:00 AM - 08:00 PM',
    organizerId: 'org_1',
    organizerName: 'Apex Events Co.',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    organizerRating: 4.9,
    status: 'completed',
    bannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    budgetTotal: 38000,
    rolesNeeded: [
      {
        id: 'role_5_1',
        title: 'Expo Floor Decorator',
        category: 'Decoration',
        quantityNeeded: 4,
        quantityFilled: 4,
        payPerWorker: 2500,
        payType: 'flat',
        shiftHours: 9,
        skillsRequired: ['Floral Design', 'Booth Assembly'],
        status: 'filled'
      }
    ],
    createdAt: '2026-07-05'
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_1',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    eventBanner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    eventCity: 'Mumbai',
    eventDate: '2026-08-15',
    jobRoleId: 'role_1_1',
    jobRoleTitle: 'VIP Banquet Waiter / Server',
    payAmount: 2400,
    workerId: 'wrk_1',
    workerName: 'Ananya Sharma',
    workerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    workerRating: 4.9,
    workerSkills: ['Catering', 'Hosting', 'Decoration'],
    organizerId: 'org_1',
    organizerName: 'Apex Events Co.',
    status: 'accepted',
    appliedAt: '2026-07-29',
    coverNote: 'Hi! I have over 4 years of experience serving VIP guests at galas. I am fully trained in food safety and own tuxedo uniform attire.',
    payoutStatus: 'escrow'
  },
  {
    id: 'app_2',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    eventBanner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    eventCity: 'Mumbai',
    eventDate: '2026-08-15',
    jobRoleId: 'role_1_3',
    jobRoleTitle: 'Event Photographer & Candid Shooter',
    payAmount: 3800,
    workerId: 'wrk_2',
    workerName: 'Rohan Verma',
    workerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    workerRating: 5.0,
    workerSkills: ['Photography', 'Audio & DJ', 'Hosting'],
    organizerId: 'org_1',
    organizerName: 'Apex Events Co.',
    status: 'accepted',
    appliedAt: '2026-07-30',
    coverNote: 'Professional Sony shooter with full lighting and fast turnaround headshots.',
    payoutStatus: 'escrow'
  },
  {
    id: 'app_3',
    eventId: 'evt_2',
    eventTitle: 'Rooftop Fashion Expo & Gala',
    eventBanner: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    eventCity: 'Bengaluru',
    eventDate: '2026-08-20',
    jobRoleId: 'role_2_3',
    jobRoleTitle: 'Event Security & Access Guard',
    payAmount: 2600,
    workerId: 'wrk_3',
    workerName: 'Vikram Malhotra',
    workerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    workerRating: 4.7,
    workerSkills: ['Security', 'General Helper', 'Cleaning'],
    organizerId: 'org_2',
    organizerName: 'Vibrant Gala Productions',
    status: 'accepted',
    appliedAt: '2026-07-31',
    coverNote: 'Licensed guard with 3 years experience managing high profile rooftop access points.',
    payoutStatus: 'escrow'
  },
  {
    id: 'app_4',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    eventBanner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    eventCity: 'Mumbai',
    eventDate: '2026-08-15',
    jobRoleId: 'role_1_2',
    jobRoleTitle: 'VIP Floor Host & Security Lead',
    payAmount: 3200,
    workerId: 'wrk_3',
    workerName: 'Vikram Malhotra',
    workerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    workerRating: 4.7,
    workerSkills: ['Security', 'General Helper'],
    organizerId: 'org_1',
    organizerName: 'Apex Events Co.',
    status: 'accepted',
    appliedAt: '2026-07-31',
    coverNote: 'Lead crowd security guard with radio headset and VIP credentials.',
    payoutStatus: 'escrow'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participantId: 'org_1',
    participantName: 'Apex Events Co.',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    participantRole: 'organizer',
    participantIds: ['wrk_1', 'org_1'],
    conversationType: 'organizer',
    targetRoleTitle: 'Event Host & Producer',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    lastMessage: 'Sounds great! I will arrive at 3:30 PM in formal attire for briefing.',
    lastMessageTime: '10:42 AM',
    unreadCount: 0
  },
  {
    id: 'conv_coworker_1',
    participantId: 'wrk_2',
    participantName: 'Rohan Verma',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    participantRole: 'worker',
    participantIds: ['wrk_1', 'wrk_2'],
    conversationType: 'coworker',
    targetRoleTitle: 'Event Photographer (Co-Worker)',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    lastMessage: 'Got it! Let us do a 5-minute call before the gala to coordinate the stage cues.',
    lastMessageTime: '11:15 AM',
    unreadCount: 0
  },
  {
    id: 'conv_coworker_2',
    participantId: 'wrk_3',
    participantName: 'Vikram Malhotra',
    participantAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    participantRole: 'worker',
    participantIds: ['wrk_1', 'wrk_3'],
    conversationType: 'coworker',
    targetRoleTitle: 'Security Lead (Co-Worker)',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    lastMessage: 'All VIP wristbands are ready at Gate B check-in table.',
    lastMessageTime: '09:50 AM',
    unreadCount: 0
  },
  {
    id: 'conv_crew_1',
    participantId: 'crew_group_evt_1',
    participantName: 'Tech Summit - Crew Operations',
    participantAvatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=80',
    participantRole: 'organizer',
    participantIds: ['org_1', 'wrk_1', 'wrk_2', 'wrk_3'],
    conversationType: 'crew_group',
    targetRoleTitle: 'Event Crew Channel (4 Members)',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    lastMessage: 'Apex Events Co.: Sound check completed. All staff report to Green Room by 3:45 PM.',
    lastMessageTime: '11:30 AM',
    unreadCount: 0,
    isGroup: true,
    groupName: 'Tech Summit Crew Channel',
    memberCount: 4,
    memberIds: ['org_1', 'wrk_1', 'wrk_2', 'wrk_3']
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'org_1',
    senderName: 'Apex Events Co.',
    senderRole: 'organizer',
    recipientId: 'wrk_1',
    message: 'Hi Ananya! We accepted your application for the VIP Banquet Server role at the AI Summit Gala.',
    timestamp: '10:30 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'wrk_1',
    senderName: 'Ananya Sharma',
    senderRole: 'worker',
    recipientId: 'org_1',
    message: 'Thank you so much! Is there any specific dress code or briefing time before doors open?',
    timestamp: '10:35 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'org_1',
    senderName: 'Apex Events Co.',
    senderRole: 'organizer',
    recipientId: 'wrk_1',
    message: 'Standard black button down shirt, black trousers, and non-slip dress shoes. Briefing starts at 3:30 PM sharply in Hall B.',
    timestamp: '10:38 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_4',
    conversationId: 'conv_1',
    senderId: 'wrk_1',
    senderName: 'Ananya Sharma',
    senderRole: 'worker',
    recipientId: 'org_1',
    message: 'Sounds great! I will arrive at 3:30 PM in formal attire for briefing.',
    timestamp: '10:42 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_cw_1',
    conversationId: 'conv_coworker_1',
    senderId: 'wrk_1',
    senderName: 'Ananya Sharma',
    senderRole: 'worker',
    recipientId: 'wrk_2',
    message: 'Hey Rohan! Saw you are covering photography for tonight\'s VIP Gala. I am lead server in Hall B. Let us sync so your flash brackets do not block the buffet flow.',
    timestamp: '11:05 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_cw_2',
    conversationId: 'conv_coworker_1',
    senderId: 'wrk_2',
    senderName: 'Rohan Verma',
    senderRole: 'worker',
    recipientId: 'wrk_1',
    message: 'Hey Ananya! Awesome working with you again! I will keep my tripods tucked by the stage wing. Let me know when the VIP champagne toast rolls out so I get the candid shots.',
    timestamp: '11:10 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_cw_3',
    conversationId: 'conv_coworker_1',
    senderId: 'wrk_1',
    senderName: 'Ananya Sharma',
    senderRole: 'worker',
    recipientId: 'wrk_2',
    message: 'Got it! Let us do a 5-minute call before the gala to coordinate the stage cues.',
    timestamp: '11:15 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_cw_4',
    conversationId: 'conv_coworker_2',
    senderId: 'wrk_3',
    senderName: 'Vikram Malhotra',
    senderRole: 'worker',
    recipientId: 'wrk_1',
    message: 'Hi Ananya, Vikram here on security duty. All VIP wristbands are ready at Gate B check-in table. Let me know if any caterer staff need access badges.',
    timestamp: '09:50 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_group_1',
    conversationId: 'conv_crew_1',
    senderId: 'org_1',
    senderName: 'Apex Events Co.',
    senderRole: 'organizer',
    recipientId: 'all',
    message: 'Welcome team to India Tech Summit Gala Night! Please ensure you have signed in at the crew entrance by 3:30 PM.',
    timestamp: '10:00 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_group_2',
    conversationId: 'conv_crew_1',
    senderId: 'wrk_1',
    senderName: 'Ananya Sharma',
    senderRole: 'worker',
    recipientId: 'all',
    message: 'Banquet team is on schedule. We are setting up dining tables 1 through 18.',
    timestamp: '10:15 AM',
    eventId: 'evt_1'
  },
  {
    id: 'msg_group_3',
    conversationId: 'conv_crew_1',
    senderId: 'org_1',
    senderName: 'Apex Events Co.',
    senderRole: 'organizer',
    recipientId: 'all',
    message: 'Sound check completed. All staff report to Green Room by 3:45 PM.',
    timestamp: '11:30 AM',
    eventId: 'evt_1'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_101',
    userId: 'org_1',
    type: 'escrow_deposit',
    amount: 14400,
    status: 'completed',
    description: 'Escrow lock for 6 Banquet Servers - India Tech Summit Gala',
    date: '2026-07-28',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night'
  },
  {
    id: 'tx_102',
    userId: 'wrk_1',
    type: 'payout_received',
    amount: 2800,
    status: 'completed',
    description: 'Payment released for Mumbai Tech Founder Mixer - Server Shift',
    date: '2026-07-25',
    eventId: 'evt_0',
    eventTitle: 'Mumbai Tech Founder Mixer'
  },
  {
    id: 'tx_103',
    userId: 'wrk_2',
    type: 'payout_received',
    amount: 4500,
    status: 'completed',
    description: 'Payment released for Royal Auto Expo Photography',
    date: '2026-07-20',
    eventId: 'evt_prev',
    eventTitle: 'Royal Auto Expo Gala'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    eventId: 'evt_prev',
    eventTitle: 'Mumbai Tech Founder Mixer',
    reviewerId: 'org_1',
    reviewerName: 'Apex Events Co.',
    reviewerRole: 'organizer',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    targetId: 'wrk_1',
    targetName: 'Ananya Sharma',
    rating: 5,
    comment: 'Ananya was extraordinary! Arrived 15 mins early, led the drink service seamlessly, and stayed to assist with venue pack-down. Will definitely re-hire!',
    date: '2026-07-26'
  },
  {
    id: 'rev_2',
    eventId: 'evt_prev_2',
    eventTitle: 'Royal Auto Expo Gala',
    reviewerId: 'org_2',
    reviewerName: 'Vibrant Gala Productions',
    reviewerRole: 'organizer',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    targetId: 'wrk_2',
    targetName: 'Rohan Verma',
    rating: 5,
    comment: 'Rohan captured phenomenal crisp event portraits! Delivered edited photos ahead of schedule. Very professional attitude.',
    date: '2026-07-21'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'wrk_1',
    title: 'Application Accepted! 🎉',
    message: 'Apex Events Co. accepted your application for VIP Banquet Waiter.',
    type: 'application',
    read: false,
    date: '10:30 AM'
  },
  {
    id: 'notif_2',
    userId: 'org_1',
    title: 'New Applicant Received 📩',
    message: 'Rohan Verma applied for Event Photographer at India Tech Summit Gala.',
    type: 'application',
    read: false,
    date: 'Yesterday'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_1',
    complainantId: 'wrk_3',
    complainantName: 'Vikram Malhotra',
    complainantRole: 'worker',
    eventId: 'evt_old',
    eventTitle: 'Bengaluru Tech Expo 2026',
    reason: 'Overtime Payment Delay',
    details: 'Organizer requested an extra 2 hours of post-event load out, but payout released only covered standard shift hours.',
    status: 'investigating',
    createdAt: '2026-07-26'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp_101',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    applicationId: 'app_1',
    raisedById: 'wrk_1',
    raisedByName: 'Ananya Sharma',
    raisedByRole: 'worker',
    againstId: 'org_1',
    againstName: 'Apex Events Co.',
    againstRole: 'organizer',
    reason: 'non_payment',
    details: 'Shift concluded 2 days ago in full compliance with lead server duties, but organizer has not confirmed completion on the escrow dashboard.',
    amountDisputed: 3500,
    status: 'under_review',
    resolutionNotes: 'Admin mediation active: contacted Apex Events Co. to verify shift log sheet.',
    createdAt: '2026-08-01'
  },
  {
    id: 'disp_102',
    eventId: 'evt_2',
    eventTitle: 'Luxury Destination Wedding Reception',
    applicationId: 'app_4',
    raisedById: 'org_2',
    raisedByName: 'Vibrant Gala Productions',
    raisedByRole: 'organizer',
    againstId: 'wrk_3',
    againstName: 'Vikram Malhotra',
    againstRole: 'worker',
    reason: 'late_arrival',
    details: 'Worker arrived 45 mins late for mandatory briefing. Requesting 20% deduction from escrow.',
    amountDisputed: 2800,
    status: 'open',
    createdAt: '2026-08-02'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_1001',
    invoiceNumber: 'INV-EC-2026-0042',
    date: '2026-08-01',
    eventId: 'evt_1',
    eventTitle: 'India Tech Summit Gala Night',
    organizerId: 'org_1',
    organizerName: 'Apex Events Co.',
    organizerGstin: '27AABCA1234F1Z8',
    items: [
      { description: 'VIP Banquet Server (2 Staff x 7 hrs)', hours: 14, rate: 500, amount: 7000 },
      { description: 'Event Photographer & Retouching (1 Staff)', hours: 8, rate: 1000, amount: 8000 },
      { description: 'Audio & DJ Setup Assistant (1 Staff)', hours: 6, rate: 450, amount: 2700 }
    ],
    subtotal: 17700,
    platformFee: 885, // 5%
    gstTax: 3186, // 18% GST on staffing services
    totalAmount: 21771,
    type: 'organizer_bill',
    status: 'escrow'
  },
  {
    id: 'inv_1002',
    invoiceNumber: 'RCPT-WRK-2026-0091',
    date: '2026-07-26',
    eventId: 'evt_prev',
    eventTitle: 'Mumbai Tech Founder Mixer',
    organizerId: 'org_1',
    organizerName: 'Apex Events Co.',
    workerId: 'wrk_1',
    workerName: 'Ananya Sharma',
    items: [
      { description: 'Lead Banquet Service Shift - 7 Hours', hours: 7, rate: 400, amount: 2800 }
    ],
    subtotal: 2800,
    platformFee: 0,
    gstTax: 0,
    totalAmount: 2800,
    type: 'worker_payout',
    status: 'paid'
  }
];
