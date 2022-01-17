export enum PhoneNumberVerification {
    PENDING = 'pending',
    COMPLETE = 'complete',
}

export enum ProfileSetup {
    PENDING = 'pending',
    COMPLETE = 'complete',
}

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETE = 'complete',
    CANCELLED = 'cancelled',
    ONGOING = 'ongoing',
}

export enum OrderType {
    CARWASH = 'carWash',
    CAR_SERVICING = 'carServicing',
    EMERGENCY_RESCUE = 'emergencyRescue',
}

export enum AccountType {
    COMPANY = 'company',
    INDIVIDUAL = 'individual',
}

export enum AccountStatus {
    WAITING_APPROVAL = 'waiting_approval',
    SUSPENDED = 'suspended',
}
