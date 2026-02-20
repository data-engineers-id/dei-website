// Event Types
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  startDate: Date;
  endDate?: Date;
  timezone: string;
  locationType: 'physical' | 'virtual' | 'hybrid';
  venue?: string;
  address?: string;
  city?: string;
  virtualLink?: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrationUrl?: string;
  maxAttendees?: number;
  registeredCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  isFeatured: boolean;
}

// Article Types (from Medium RSS)
export interface Article {
  title: string;
  url: string;
  publishedAt: Date;
  author: string;
  excerpt: string;
  categories: string[];
  thumbnail?: string;
  content?: string;
}

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  email?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  displayOrder: number;
}

// Site Configuration
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  email: string;
  linkedinUrl: string;
  telegramUrl: string;
  mediumUrl: string;
  foundedYear: number;
  memberCount: number;
}
