import { redisClient } from '../../utils/redis_client';
import {
    AfterInsert,
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { PartnerType } from '../../enums/enums';
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

    @Column('text', {
        nullable: true,
        array: true,
    })
    services: string[];

    @Column({
        unique: false,
        nullable: true,
        enum: PartnerType,
    })
    partnerType: string | null;

    @OneToOne(() => Individual, (individual) => individual.partner, {
        cascade: true,
    })
    @JoinColumn()
    individualDetails: Individual | null;

    @OneToOne(() => Company, (company) => company.partner, {
        cascade: true,
    })
    @JoinColumn()
    companyDetails: Company | null;

    @OneToMany(() => Order, (order) => order.partner, {
        cascade: true,
    })
    orders: Order[] | null;
}
