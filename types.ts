export enum MBTIType {
  ENTP = 'ENTP', ENTJ = 'ENTJ', ENFP = 'ENFP', ENFJ = 'ENFJ',
  INTP = 'INTP', INTJ = 'INTJ', INFP = 'INFP', INFJ = 'INFJ',
  ESTP = 'ESTP', ESFP = 'ESFP', ESTJ = 'ESTJ', ESFJ = 'ESFJ',
  ISTP = 'ISTP', ISFP = 'ISFP', ISTJ = 'ISTJ', ISFJ = 'ISFJ',
  BUNDLE = 'BUNDLE'
}

export interface ChildProfile {
  name: string;
  age: string; // Changed to string to allow flexible input like "7세" or "초3"
  gender: string;
  schoolType: string;
  mbti?: string;
  notes?: string;
}

export interface ParentProfile {
  name: string;
  mbti: string;
  notes?: string;
}

export interface User {
  email: string;
  licenseKey: string; // Stored for watermark
  purchasedProducts: string[]; // List of product IDs
  childProfile?: ChildProfile;
  parentProfile?: ParentProfile; // Deprecated, use parentProfile1
  parentProfile1?: ParentProfile;
  parentProfile2?: ParentProfile;
}

export interface Product {
  id: string;
  mbtiType: MBTIType;
  title: string;
  price: string;
  description: string;
  gumroadUrl: string;
}

export interface ContentSection {
  title: string;
  content: string | string[]; // String for text, Array for lists
  type: 'text' | 'list' | 'script' | 'check' | 'header';
}

export interface MBTIContent {
  mbtiType: MBTIType;
  sections: ContentSection[];
}