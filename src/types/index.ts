export type UserRole = 'organizer' | 'worker' | 'admin';

export type ColorTheme = 'emerald' | 'violet' | 'amber' | 'cyan' | 'rose';

export type JobCategory = 
  | 'Catering'
  | 'Decoration'
  | 'Hosting'
  | 'Photography'
  | 'Security'
  | 'Cleaning'
  | 'Audio & DJ'
  | 'General Helper';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  city: string;
  skills?: JobCategory[];
  experience?: string;
  hourlyRate?: number;
  bio?: string;
  rating: number;
  reviewCount: number;
  walletBalance: number;
  isVerified: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  verificationDoc?: {
    type: string;
    idNumber: string;
    submittedAt: string;
  };
  twoFactorEnabled?: boolean;
  subscriptionTier?: 'starter' | 'pro' | 'enterprise';
  badges?: string[];
  xpPoints?: number;
  availability?: Record<string, 'available' | 'busy'>;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface JobRoleNeeded {
  id: string;
  title: string;
  category: JobCategory;
  quantityNeeded: number;
  quantityFilled: number;
  payPerWorker: number; // e.g. total shift pay or per hour
  payType: 'hourly' | 'flat';
  shiftHours: number;
  skillsRequired: string[];
  status: 'open' | 'filled' | 'cancelled';
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  city: string;
  venue: string;
  startDate: string;
  endDate: string;
  time: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string;
  organizerRating: number;
  status: 'draft' | 'pending_approval' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  bannerUrl: string;
  budgetTotal: number;
  rolesNeeded: JobRoleNeeded[];
  coordinates?: { lat: number; lng: number };
  isPriorityListing?: boolean;
  escrowStatus?: 'funded' | 'released' | 'disputed';
  createdAt: string;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type PayoutStatus = 'unpaid' | 'escrow' | 'released';

export interface JobApplication {
  id: string;
  eventId: string;
  eventTitle: string;
  eventBanner?: string;
  eventCity?: string;
  eventDate?: string;
  jobRoleId: string;
  jobRoleTitle: string;
  payAmount: number;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  workerRating: number;
  workerSkills: JobCategory[];
  organizerId: string;
  organizerName: string;
  status: ApplicationStatus;
  appliedAt: string;
  proposedRate?: number;
  coverNote: string;
  payoutStatus: PayoutStatus;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  message: string;
  timestamp: string;
  eventId?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: UserRole;
  participantIds?: string[];
  conversationType?: 'organizer' | 'coworker' | 'crew_group';
  targetRoleTitle?: string;
  eventId?: string;
  eventTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup?: boolean;
  groupName?: string;
  memberCount?: number;
  memberIds?: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'escrow_deposit' | 'payout_received' | 'platform_fee' | 'deposit' | 'withdrawal' | 'dispute_refund' | 'subscription';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  date: string;
  eventId?: string;
  eventTitle?: string;
  invoiceId?: string;
}

export interface Review {
  id: string;
  eventId: string;
  eventTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: UserRole;
  reviewerAvatar: string;
  targetId: string;
  targetName: string;
  rating: number;
  comment: string;
  punctualityRating?: number;
  communicationRating?: number;
  date: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'approval' | 'payment' | 'chat' | 'system' | 'dispute';
  read: boolean;
  date: string;
  link?: string;
}

export interface Complaint {
  id: string;
  complainantId: string;
  complainantName: string;
  complainantRole: UserRole;
  eventId: string;
  eventTitle: string;
  reason: string;
  details: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  resolution?: string;
}

export type DisputeReason = 'non_payment' | 'no_show' | 'late_arrival' | 'unprofessional_conduct' | 'breach_of_terms' | 'other';

export interface Dispute {
  id: string;
  eventId: string;
  eventTitle: string;
  applicationId?: string;
  raisedById: string;
  raisedByName: string;
  raisedByRole: UserRole;
  againstId: string;
  againstName: string;
  againstRole: UserRole;
  reason: DisputeReason;
  details: string;
  amountDisputed: number;
  status: 'open' | 'under_review' | 'resolved_worker' | 'resolved_organizer' | 'resolved_split' | 'dismissed';
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface InvoiceItem {
  description: string;
  hours?: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  eventId: string;
  eventTitle: string;
  organizerId: string;
  organizerName: string;
  organizerGstin?: string;
  workerId?: string;
  workerName?: string;
  items: InvoiceItem[];
  subtotal: number;
  platformFee: number;
  gstTax: number;
  totalAmount: number;
  type: 'organizer_bill' | 'worker_payout';
  status: 'paid' | 'escrow' | 'refunded';
}
