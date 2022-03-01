import { Column, Entity, OneToOne } from 'typeorm';
import { Model } from './model';
import { Partner } from './partners.entity';

@Entity({ name: 'individuals' })
export class Individual extends Model {
    @Column({
        unique: false,
        nullable: true,
    })
    firstName: string | null | undefined;

    @Column({
        unique: false,
        nullable: true,
    })
    lastName!: string | null;

    @OneToOne(() => Partner, (partner) => partner.individualDetails, {
        onDelete: 'CASCADE',
    })
    partner: Partner | undefined;
}
