export interface ISubscription {
  type: "free_trial" | "basic" | "premium" | "enterprise";
  startDate: string;
  endDate: string;
  isActive: boolean;
  features: string[];
}

// Define the user type based on your API response
export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "doctor" | "nurse" | "staff";
  isActive?: boolean;
  lastLogin?: string;
  profileImage?: string;
  specialization?: string;
  contactNumber?: string;
  createdBy?: string;
  adminId?: string;
  subscription?: ISubscription;
  createdAt?: string;
  updatedAt?: string;
  password?: string; // Optional, only if you need it for some reason

  // Methods for the model, not used in frontend
  matchPassword?: (enteredPassword: string) => Promise<boolean>;
  getSignedJwtToken?: () => string;
}

export interface UserCreateData {
  name: string;
  email: string;
  password?: string;
  role: string;
  contactNumber?: string;
  specialization?: string;
}

export interface UserUpdateData {
  name?: string;
  // email?: string;  // Email updates not supported as per backend
  role?: string;
  contactNumber?: string;
  specialization?: string;
  isActive?: boolean;
}

export interface SubscriptionUpdateData {
  type: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive?: boolean;
  features?: string[];
}

export interface UsersResponse {
  data: User[];
  total: number;
  pages: number;
  currentPage: number;
}

// Updated UserStats interface to match the enhanced getUserStats controller
export interface UserStats {
  totalUsers: number;
  totalAdmins?: number;
  activeAdmins?: number;
  totalDoctors: number;
  totalNurses: number;
  totalStaff: number;
  activeUsers: number;
  inactiveUsers: number;
  subscription?: {
    type: string;
    isActive: boolean;
    endDate: string;
    daysRemaining: number;
    features: string[];
  };
  subscriptionStats?: {
    freeTrials: number;
    basic: number;
    premium: number;
    enterprise: number;
    expired: number;
  };
  recentUsers: {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  }[];
  recentLogins: {
    name: string;
    email: string;
    role: string;
    lastLogin: string;
  }[];
}
