import { Column, Entity } from "typeorm";
import { Model } from "./model";

@Entity({ name: "car_servicing" })
export class CarServicing extends Model {
  @Column({
    unique: false,
    default: false,
  })
  engineOil: boolean;

  @Column({
    unique: false,
    default: false,
  })
  gearboxOil: boolean;

  @Column({
    unique: false,
    default: false,
  })
  airFilter: boolean;

  @Column({
    unique: false,
    default: false,
  })
  sparkPlugs: boolean;

  @Column({
    unique: false,
    default: false,
  })
  brakePads: boolean;
  
  @Column({
    unique: false,
    default: false,
  })
  belts: boolean;

  @Column({
    unique: false,
    default: false,
  })
  tyres: boolean;

  @Column({
    unique: false,
    default: false,
  })
  inCall: boolean;
  
  @Column({
    unique: false,
    default: false,
  })
  outCall: boolean;

}
