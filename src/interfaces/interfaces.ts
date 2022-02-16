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

export interface CarWashOrderRequest {
    packageName: string;
    carType: string;
}

export interface CarServingOrderRequest {
    carMake: string;
    carModel: string;
    services: any[];
}

export interface EmergencyRescueOrderRequest {
    jumpStarting: boolean;
    carTowing: boolean;
}

export interface OrderRequest {
    orderType: string;
    userLocation: {
        coordinates: {
            latitude: string;
            longitude: string;
        };
    };
    details:
        | CarWashOrderRequest
        | CarServingOrderRequest
        | EmergencyRescueOrderRequest;
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
