
export type ReportStatus = 'Pending' | 'Investigating' | 'Resolved' | 'Rejected';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: number;
}

export interface Report {
  id: string;
  ticketNumber: string;
  userId?: string; 
  title: string;
  category: string;
  location: string;
  subLocation?: string; 
  ward?: string; 
  description: string;
  date: string;
  status: ReportStatus;
  isAnonymous: boolean;
  priority: 'Low' | 'Medium' | 'High';
  aiSummary?: string;
  timestamp: number;
  // New mandatory fields for tracking without login
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  // Optional review field for tracking resolution quality
  review?: {
    rating: number;
    comment: string;
  };
}

export const CATEGORIES = [
  'রাস্তা বা ফুটপাতে চাঁদাবাজি',
  'দোকান বা ব্যবসা প্রতিষ্ঠানে চাঁদাবাজি',
  'সরকারি অফিসে ঘুষ বা দুর্নীতি',
  'পরিবহন খাতে চাঁদাবাজি',
  'রাজনৈতিক প্রভাব খাটিয়ে চাঁদাবাজি',
  'অন্যান্য'
];

export const DISTRICTS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Comilla'
];

export const DHAKA_SUB_LOCATIONS = [
  'সাভার পৌরসভা',
  'আশুলিয়া ইউনিয়ন',
  'ধামসোনা ইউনিয়ন',
  'ইয়ারপুর ইউনিয়ন',
  'পাথালিয়া ইউনিয়ন',
  'শিমুলিয়া ইউনিয়ন',
  'বিরুলিয়া ইউনিয়ন',
  'বনগাঁও ইউনিয়ন',
  'তেঁতুলঝোড়া ইউনিয়ন',
  'ভাকুর্তা ইউনিয়ন',
  'কাউন্দিয়া ইউনিয়ন',
  'আমিনবাজার ইউনিয়ন',
  'সাভার ইউনিয়ন'
];

export const SAVAR_WARDS = [
  'ওয়ার্ড নং ১',
  'ওয়ার্ড নং ২',
  'ওয়ার্ড নং ৩',
  'ওয়ার্ড নং ৪',
  'ওয়ার্ড নং ৫',
  'ওয়ার্ড নং ৬',
  'ওয়ার্ড নং ৭',
  'ওয়ার্ড নং ৮',
  'ওয়ার্ড নং ৯'
];
