// File: src/types/guard.types.ts

// Enums for various guard-related types
export enum GuardStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  OTHER = "OTHER",
}

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  OTHER = "OTHER",
}

export enum AddressType {
  LOCAL = "LOCAL",
  PERMANENT = "PERMANENT",
}

export enum ContactType {
  PERSONAL = "PERSONAL",
  ALTERNATE = "ALTERNATE",
}

export enum RelationshipType {
  FATHER = "FATHER",
  MOTHER = "MOTHER",
  SPOUSE = "SPOUSE",
  BROTHER = "BROTHER",
  SISTER = "SISTER",
  SON = "SON",
  DAUGHTER = "DAUGHTER",
  OTHER = "OTHER",
}

export enum DocumentType {
  ID_CARD = "ID_CARD",
  LICENSE = "LICENSE",
  CERTIFICATE = "CERTIFICATE",
  OTHER = "OTHER",
}

// Form data interfaces - Updated with all requirements
export interface PersonalDetails {
  profilePhoto: File | null;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // Only DOB, removed age fields
  sex: string;
  bloodGroup: string; // Dropdown selection
  nationality: string;
  height: string;
  heightUnit: string; // cm or inch
  weight: string;
  identificationMark: string;
  fatherName: string;
  motherName?: string;
  maritalStatus: string;
  spouseName?: string;
  spouseDob?: string; // Only DOB for spouse, removed age
}

export interface ContactDetails {
  mobileNumber: string; // 10-digit number (backend adds +91)
  alternateNumber?: string; // 10-digit number (backend adds +91)
  emergencyContact: {
    firstName: string;
    middleName?: string;
    lastName: string;
    relationship: string;
    contactNumber: string; // 10-digit number (backend adds +91)
  };
}

export interface AddressDetails {
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  pincode: string;
  state: string;
  landmark?: string;
}

export interface Address {
  localAddress: AddressDetails;
  permanentAddress: AddressDetails; // Must match Aadhaar Card
  sameAsPermanent: boolean;
}

export interface EmploymentDetails {
  companyId: string;
  dateOfJoining: string;
  referredBy: string;
  referralContactNumber: string; // 10-digit number (backend adds +91)
  relationshipWithGuard: string;
  guardType: string; // From settings
  psaraCertificationStatus: string;
  status: string;
  isExDefense: boolean;
  licenseNumber?: string;
  dateOfIssue?: string;
  validUntil?: string;
  validIn?: string;
}

export interface DocumentVerificationItem {
  type: string;
  isSelected: boolean;
  // No file upload - just verification marking
}

export interface DocumentVerification {
  documents: DocumentVerificationItem[];
}

export interface GuardFormData {
  personalDetails: PersonalDetails;
  contactDetails: ContactDetails;
  address: Address;
  employmentDetails: EmploymentDetails;
  documentVerification: DocumentVerification;
}

// API request/response interfaces
export interface CreateGuardAddress {
  line1: string;
  line2?: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string;
  landmark?: string;
  country: string;
  type: AddressType;
  isPrimary: boolean;
}

export interface CreateGuardContact {
  phoneNumber: string;
  contactType: ContactType;
  isVerified: boolean;
}

export interface CreateGuardEmergencyContact {
  contactName: string;
  relationship: string;
  phoneNumber: string;
}

export interface CreateGuardFamilyMember {
  relationshipType: RelationshipType;
  name: string;
}

export interface CreateGuardDocument {
  type: DocumentType;
  documentNumber: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  isVerified: boolean;
}

export interface CreateGuardRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  status: GuardStatus;
  userType: string; // Always "GUARD"
  nationality?: string;
  sex?: Sex;
  bloodGroup?: string;
  height?: number; // Converted to cm
  weight?: number;
  identificationMark?: string;
  martialStatus?: MaritalStatus;
  photo?: File;
  addresses?: CreateGuardAddress[];
  contacts?: CreateGuardContact[];
  emergencyContacts?: CreateGuardEmergencyContact[];
  familyMembers?: CreateGuardFamilyMember[];
  documents?: CreateGuardDocument[];
  // No files array - documents are verification only
}

export interface CreateGuardResponse {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  status: GuardStatus;
  userType: string;
  nationality?: string;
  sex?: Sex;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  identificationMark?: string;
  martialStatus?: MaritalStatus;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  agencyId: string;
}
