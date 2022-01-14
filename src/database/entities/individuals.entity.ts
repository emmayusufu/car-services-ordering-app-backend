import {
  Column,
  Entity,
  OneToOne
} from "typeorm";
import { Model } from "./model";
import { Partner } from "./partners.entity";

@Entity({ name: "individuals" })
export class Individual extends Model {
  @Column({
    unique: false,
    nullable: true,
  })
  firstName: string;

  @Column({
    unique: false,
    nullable: true,
  })
  lastName: string;

  @OneToOne(()=>Partner,partner=>partner.individualDetails)
  partner:Partner
}
