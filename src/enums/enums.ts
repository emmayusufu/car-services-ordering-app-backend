export enum PhoneNumberVerification {
    PENDING = 'pending',
    COMPLETE = 'complete',
}

export enum ProfileSetup {
    PENDING = 'Pending',
    COMPLETE = 'Complete',
}

export enum OrderStatus {
    PENDING = 'Pending',
    COMPLETE = 'Complete',
    ONGOING = 'Ongoing',
}

export enum OrderType {
    CARWASH = 'Car wash',
    CAR_SERVICING = 'Car servicing',
    EMERGENCY_RESCUE = 'Emergency rescue',
}

export enum AccountType {
    COMPANY = 'company',
    INDIVIDUAL = 'individual',
}

export enum AccountStatus {
    WAITING_APPROVAL = 'waiting_approval',
    SUSPENDED = 'suspended',
}

export enum REDIS_KEYS {
    PARTNER_LOCATIONS = 'partnerLocations',
}

export enum CarServiceType {
    REPLACE = 'replace',
    CHECK = 'check',
}
