import { Column, Entity } from 'typeorm';
import { Model } from './model';

@Entity({ name: 'car_servicing' })
export class CarServicing extends Model {
    @Column({
        unique: false,
        default: false,
    })
    engineOil: boolean | null;

    @Column({
        unique: false,
        default: false,
    })
    gearboxOil: boolean | null;

    @Column({
        unique: false,
        default: false,
    })
    airFilter: boolean | null;

    @Column({
        unique: false,
        default: false,
    })
    sparkPlugs: boolean | null;

    @Column({
        unique: false,
        default: false,
    })
    brakePads: boolean | null;

    @Column({
        unique: false,
        default: false,
    })
    belts: boolean | null;

    @Column({
        unique: false,
        default: false,
    })
    tyres: boolean | null;

    @Column({
        unique: false,
        default: false,
    })
    inCall: boolean | null;

    @Column({
        unique: false,
        default: false,
    })
    outCall: boolean | null;
}
