import { Router } from 'express';

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
