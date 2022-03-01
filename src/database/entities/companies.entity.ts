import { Column, Entity, OneToOne } from 'typeorm';
import { Model } from './model';
import { Partner } from './partners.entity';

@Entity({ name: 'companies' })
export class Company extends Model {
    @Column({
        nullable: false,
        unique: false,
    })
    companyName!: string;

    @OneToOne(() => Partner, (partner) => partner.companyDetails, {
        onDelete: 'CASCADE',
    })
    partner: Partner | undefined;
}
