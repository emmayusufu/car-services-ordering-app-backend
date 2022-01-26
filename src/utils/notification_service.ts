import { EventEmitter } from 'events';
import { OrderRequest } from '../interfaces/interfaces';
import { getIO } from './socket_io';

export class NotificationService extends EventEmitter {
    private _count: number = 0;
    private _response: string = 'Declined';
    private _timer: number = 1;

    private static _instance: NotificationService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new NotificationService();
        return this._instance;
    }

    public set response(value: string) {
        this._response = value;
    }

    notifyPartners(
        partners: { socketId: string }[],
        orderRequest: OrderRequest
    ) {
        const partner = partners[this._count];

        getIO().to(partner.socketId).emit('orderRequest', orderRequest);

        this._count += 1;

        // if the partner does respond in less than 10 secs, stop the execution
        let interval = setInterval(() => {
            if (this._response == 'Accepted') {
                this._response = 'Declined';
                clearInterval(interval);
                console.log('a user was gotten');
                return;
            } else if (this._response == 'Declined') {
                if (this._timer === 6) {
                    this._timer = 1;
                    clearInterval(interval);
                    if (this._count <= partners.length - 1) {
                        this.notifyPartners(partners, orderRequest);
                    } else {
                        console.log('no more users');
                        return;
                    }
                }
            }
            this._timer += 1;
        }, 1000);
    }
}
