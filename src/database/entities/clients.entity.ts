import { Column, Entity, OneToMany } from 'typeorm';
import { PhoneNumberVerification, ProfileSetup } from '../../enums/enums';
import { Model } from './model';
import { Order } from './orders.entity';

@Entity({ name: 'clients' })
export class Client extends Model {
    @Column({
        unique: false,
        nullable: true,
    })
    firstName: string | undefined;

    @Column({
        unique: false,
        nullable: true,
    })
    lastName: string | undefined;

    @Column({
        unique: true,
        nullable: true,
    })
    phoneNumber: string | undefined;

    @Column({
        unique: false,
        nullable: true,
        enum: ProfileSetup,
        default: ProfileSetup.PENDING,
    })
    profileSetup: string | undefined;

    @OneToMany(() => Order, (order) => order.client)
    orders: Order[] | undefined;
}
