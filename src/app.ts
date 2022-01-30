import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { logger } from './utils/logger';
import ClientsRouter from './components/clients/clients.router';
import PartnersRouter from './components/partners/partners.router';
import EmergencyRescueRouter from './components/emergency_rescue/emergency_rescue.router';
import CarServicingRouter from './components/car_servicing/car_servicing.router';
import CarWashRouter from './components/car_wash/car_wash.router';
import OrdersRouter from './components/orders/orders.router';
import cors from 'cors';

const app = express();
app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.get('/', (_req, res) => {
    res.json({ message: `Server is up and running` });
});

[
    new ClientsRouter(),
    new PartnersRouter(),
    new EmergencyRescueRouter(),
    new CarServicingRouter(),
    new CarWashRouter(),
    new OrdersRouter(),
].map(({ path, router }) => {
    return app.use(path, router);
});

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
    const message = error.message || 'Something went wrong';
    logger.error(
        `[${req.method}] ${req.path} >> StatusCode:: {status}, Message:: ${message}`
    );
    res.status(500).json({ message });
});

export { app };
