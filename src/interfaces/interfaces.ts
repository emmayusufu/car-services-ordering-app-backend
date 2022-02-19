import { Request, Router } from 'express';
export interface AppRouter {
    path: string;
    router: Router;
}

export interface IGetUserAuthInfoRequest extends Request {
    user: {
        uuid: string;
        accountType: string;
    };
}

export interface CarWashOrderDetails {
    packageName: string;
    carType: string;
}

export interface CarServingOrderDetails {
    carMake: string;
    carModel: string;
    services: any[];
}

export interface EmergencyRescueOrderDetails {
    jumpStarting: boolean;
    carTowing: boolean;
}

export interface OrderRequest {
    orderType: string;
    userLocation: UserLocation;
    details: OrderDetails;
}

export interface OrderDetails {
    carWash?: CarWashOrderDetails;
    carServicing?: CarServingOrderDetails;
    emergencyRescue?: EmergencyRescueOrderDetails;
}

export interface UserLocation {
    geoAddress: string;
    geoCoordinates: {
        latitude: string;
        longitude: string;
    };
}

export interface ServerToClientEvents {
    newClient: (data: {
        createdAt: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        profileSetup: string;
        updatedAt: string;
        uuid: string;
    }) => void;
    privateMessage: (data: { body: string }) => void;
}
