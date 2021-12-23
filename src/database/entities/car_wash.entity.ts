import { Column, Entity } from "typeorm";
import { Model } from "./model";

@Entity({ name: "car_wash" })
export class CarWash extends Model {
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
