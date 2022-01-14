import { Column, Entity } from "typeorm";
import { Model } from "./model";

@Entity({name:"emergency_rescue"})
export class EmergencyRescue extends Model {
  @Column({
    unique: false,
    default: false,
  })
  carTowing: boolean;

  @Column({
    unique: false,
    default: false,
  })
  jumpStarting: boolean;
}
