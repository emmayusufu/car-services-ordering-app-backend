import { OrderDetails, UserLocation } from '../../interfaces/interfaces';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OrderProgress, OrderType } from '../../enums/enums';
import { Client } from './clients.entity';
import { Model } from './model';
import { Partner } from './partners.entity';

@Entity({ name: 'orders' })
export class Order extends Model {
    @ManyToOne(() => Client, (client) => client.orders, {
        onDelete: 'CASCADE',
    })
    client: Client;

    @ManyToOne(() => Partner, (partner) => partner.orders, {
        onDelete: 'CASCADE',
    })
    partner: Partner;

    @Column({
        unique: false,
        nullable: false,
        enum: OrderType,
    })
    orderType: string;

    @Column({
        unique: false,
        nullable: true,
    })
    review: string;

    @Column({
        unique: false,
        nullable: false,
        default: 0,
    })
    rating: number;

    @Column('json', {
        unique: false,
        nullable: false,
    })
    clientLocation: UserLocation;

    @Column('jsonb', {
        unique: false,
        nullable: false,
    })
    orderDetails: OrderDetails;

    @Column({
        unique: false,
        nullable: false,
        enum: OrderProgress,
        default: OrderProgress.WAITING_FOR_DISPATCH,
    })
    orderProgress: String;
}
