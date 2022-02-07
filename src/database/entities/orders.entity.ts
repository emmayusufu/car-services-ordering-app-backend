import { Column, Entity, ManyToOne } from 'typeorm';
import { OrderStatus, OrderType } from '../../enums/enums';
import { Client } from './clients.entity';
import { Model } from './model';
import { Partner } from './partners.entity';

@Entity({ name: 'orders' })
export class Order extends Model {
    @ManyToOne(() => Client, (client) => client.orders)
    client: Client;

    @ManyToOne(() => Partner, (partner) => partner.orders)
    partner: Partner | null;

    @Column({
        unique: false,
        nullable: false,
        enum: OrderType,
    })
    type: string;

    @Column({
        unique: false,
        nullable: true,
    })
    review: string;

    @Column({
        unique: false,
        nullable: true,
    })
    rating: number;

    @Column({
        unique: false,
        nullable: false,
    })
    location: string;

    @Column({
        unique: false,
        nullable: false,
        enum: OrderType,
    })
    details: string;

    @Column({
        unique: false,
        nullable: false,
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: string;

    toJSON() {
        return { ...this, id: undefined, details: JSON.parse(this.details) };
    }
}
