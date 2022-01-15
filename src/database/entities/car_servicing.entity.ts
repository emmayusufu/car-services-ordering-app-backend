import { Column, Entity } from "typeorm";
import { Model } from "./model";

@Entity({ name: "car_servicing" })
export class CarServicing extends Model {
  @Column({
    unique: false,
    default: false,
  })
  engineOil: boolean  | undefined ;

  @Column({
    unique: false,
    default: false,
  })
  gearboxOil: boolean | undefined ;

  @Column({
    unique: false,
    default: false,
  })
  airFilter: boolean | undefined ;

  @Column({
    unique: false,
    default: false,
  })
  sparkPlugs: boolean | undefined ;

  @Column({
    unique: false,
    default: false,
  })
  brakePads: boolean | undefined ;
  
  @Column({
    unique: false,
    default: false,
  })
  belts: boolean | undefined ;

  @Column({
    unique: false,
    default: false,
  })
  tyres: boolean | undefined ;

  @Column({
    unique: false,
    default: false,
  })
  inCall: boolean | undefined ;
  
  @Column({
    unique: false,
    default: false,
  })
  outCall: boolean | undefined ;

}
