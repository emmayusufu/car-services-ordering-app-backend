import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { logger } from './utils/logger';
import ClientsRouter from './components/clients/clients.router';
import PartnersRouter from './components/partners/partners.router';
import OrdersRouter from './components/orders/orders.router';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

const app = express();

// app.use(compression());
// app.use(helmet());

app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.get('/', (_req, res) => {
    res.json({ message: `Server is up and running` });
});

[new ClientsRouter(), new PartnersRouter(), new OrdersRouter()].map(
    ({ path, router }) => {
        return app.use(path, router);
    }
);

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
    const message = error.message || 'Something went wrong';
    logger.error(
        `[${req.method}] ${req.path} >> StatusCode:: {status}, Message:: ${message}`
    );
    res.status(500).json({ message });
});

export { app };
