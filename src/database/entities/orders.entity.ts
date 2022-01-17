import { Column, Entity, ManyToOne } from 'typeorm';
import { OrderStatus, OrderType } from '../../enums/enums';
import { Client } from './clients.entity';
import { Model } from './model';
import { Partner } from './partners.entity';

@Entity({ name: 'orders' })
export class Order extends Model {
    @ManyToOne(() => Client, (client) => client.orders)
    client: Client | null;

    @ManyToOne(() => Partner, (partner) => partner.orders)
    partner: Partner | null;

    @Column({
        unique: false,
        nullable: false,
        enum: OrderType,
    })
    type: string | null;

    @Column({
        unique: false,
        nullable: false,
        enum: OrderStatus,
    })
    status: string | null;
}
