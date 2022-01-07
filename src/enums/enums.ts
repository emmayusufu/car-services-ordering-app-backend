export enum PhoneNumberVerification {
  PENDING = "pending",
  COMPLETE = "complete",
}

export enum ProfileSetup {
  PENDING = "pending",
  COMPLETE = "complete",
}

export enum OrderStatus {
  PENDING = "pending",
  COMPLETE = "complete",
  CANCELLED = "cancelled",
}

export enum AccountType {
  COMPANY = "company",
  INDIVIDUAL = "individual"
}

export enum PartnerAccountStatus {
  WAITING_APPROVAL = "waiting_approval",
  SUSPENDED = "suspended",
  PROFILE_SETUP_COMPLETE  ="profile_setup_complete",
  PROFILE_SETUP_PENDING = "profile_setup_pending" 
}
