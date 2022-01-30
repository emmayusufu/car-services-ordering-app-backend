import { Request, Router } from 'express';
import { OrderType } from '../enums/enums';

export interface AppRouter {
    path: string;
    router: Router;
}

export interface IGetUserAuthInfoRequest extends Request {
    user: string; // or any other type
}

export interface CarWashOrderRequest {
    outCall: boolean;
    inCall: boolean;
}

export interface CarServingOrderRequest {}

export interface EmergencyRescueOrderRequest {}

export interface OrderRequest {
    uuid: string;
    locationCoordinates: {
        latitude: string;
        longitude: string;
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
