export type Role = 'NOTARIUS' | 'CLIENT';

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export type PropertyType =
  | 'REAL_ESTATE'
  | 'VEHICLE'
  | 'BUSINESS'
  | 'INTELLECTUAL'
  | 'OTHER';

export type DocumentType =
  | 'PASSPORT'
  | 'PROPERTY_CERTIFICATE'
  | 'TECHNICAL_PASSPORT'
  | 'POWER_OF_ATTORNEY'
  | 'CONTRACT'
  | 'OTHER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface Property {
  id: string;
  type: PropertyType;
  name: string;
  description?: string;
  address?: string;
  cadastralNumber?: string;
  estimatedValue?: number;
}

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ApplicationHistory {
  id: string;
  status: ApplicationStatus;
  comment?: string;
  changedBy: string;
  createdAt: string;
}

export interface Application {
  id: string;
  title: string;
  description?: string;
  status: ApplicationStatus;
  propertyType: PropertyType;
  notarius: User;
  sender: User;
  receiver: User;
  property?: Property;
  documents: Document[];
  history: ApplicationHistory[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: 'Qoralama',
  SUBMITTED: 'Yuborilgan',
  IN_REVIEW: 'Ko\'rib chiqilmoqda',
  APPROVED: 'Tasdiqlangan',
  REJECTED: 'Rad etilgan',
  COMPLETED: 'Yakunlangan',
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  REAL_ESTATE: 'Ko\'chmas mulk',
  VEHICLE: 'Transport vositasi',
  BUSINESS: 'Biznes / ulush',
  INTELLECTUAL: 'Intellektual mulk',
  OTHER: 'Boshqa',
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  PASSPORT: 'Pasport',
  PROPERTY_CERTIFICATE: 'Mulk guvohnomasi',
  TECHNICAL_PASSPORT: 'Texnik pasport',
  POWER_OF_ATTORNEY: 'Ishonchnoma',
  CONTRACT: 'Shartnoma',
  OTHER: 'Boshqa',
};
