import { Router } from 'express';
import { OrderType } from '../enums/enums';

export interface AppRouter {
    path: string;
    router: Router;
}

export interface CarWashOrderRequest {
    firstName: string;
    lastName: string;
    uuid: string;
    phoneNumber: string;
    locationCoordinates: {
        latitude: string;
        longitude: string;
    };
}

export interface OrderRequest {
    clientDetails: {
        uuid: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
    orderDetails: {
        orderType: OrderType;
        locationCoordinates: {
            latitude: string;
            longitude: string;
        };
    };
}
