import { Column, Entity, OneToMany } from 'typeorm';
import { ProfileSetup } from '../../enums/enums';
import { Model } from './model';
import { Order } from './orders.entity';

@Entity({ name: 'clients' })
export class Client extends Model {
    @Column({
        unique: false,
        nullable: true,
    })
    firstName: string | null;

    @Column({
        unique: false,
        nullable: true,
    })
    lastName: string | null;

    @Column({
        unique: true,
        nullable: true,
    })
    phoneNumber: string | null;

    @Column({
        unique: false,
        nullable: true,
        enum: ProfileSetup,
        default: ProfileSetup.PENDING,
    })
    profileSetup: string;

    @OneToMany(() => Order, (order) => order.client, {
        cascade: true,
    })
    orders: Order[] | undefined;

    toJSON(): this & { id: any } {
        return {
            ...this,
            id: undefined,
            refreshToken: undefined,
            createdAt: undefined,
            updatedAt: undefined,
        };
    }
}
