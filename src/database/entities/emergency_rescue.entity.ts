import { Column, Entity } from "typeorm";
import { Model } from "./model";

@Entity({name:"emergency_rescue"})
export class EmergencyRescue extends Model {
  @Column({
    unique: false,
    default: false,
  })
  carTowing: boolean | undefined ;

  @Column({
    unique: false,
    default: false,
  })
  jumpStarting: boolean | undefined ;
}
