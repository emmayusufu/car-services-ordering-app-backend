import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AccountType, AccountStatus, ProfileSetup } from '../../enums/enums';
import { Company } from './companies.entity';
import { Individual } from './individuals.entity';
import { Model } from './model';
import { Order } from './orders.entity';

@Entity({ name: 'partners' })
export class Partner extends Model {
    @Column({
        unique: true,
        nullable: true,
    })
    phoneNumber: string | null;

    @Column({
        nullable: false,
        default: false,
    })
    emergencyRescue: boolean;

    @Column({
        nullable: false,
        default: false,
    })
    carWash: boolean;

    @Column({
        nullable: false,
        default: false,
    })
    carServicing: boolean;

    @Column({
        unique: false,
        nullable: true,
        enum: AccountType,
    })
    accountType: string | null;

    @Column({
        unique: false,
        nullable: true,
        enum: ProfileSetup,
        default: ProfileSetup.PENDING,
    })
    profileSetup: string | null;

    @Column({
        unique: false,
        nullable: true,
        enum: AccountStatus,
    })
    accountStatus: string | null;

    @OneToOne(() => Individual, (individual) => individual.partner)
    @JoinColumn()
    individualDetails: Individual | null;

    @OneToOne(() => Company, (company) => company.partner)
    @JoinColumn()
    companyDetails: Company | null;

    @OneToMany(() => Order, (order) => order.partner)
    orders: Order[] | null;
}
