import {
  Column,
  Entity,
  OneToMany,
} from "typeorm";
import { PhoneNumberVerification, ProfileSetup } from "../../enums/enums";
import { Model } from "./model";
import { Order } from "./orders.entity";

@Entity({ name: "clients" })
export class Client extends Model {
  @Column({
    unique:false,
    nullable:true,
  })
  firstName: string;

  @Column({
    unique:false,
    nullable:true,
  })
  lastName: string;

  @Column({
    unique:true,
    nullable:true,
  })
  phoneNumber: string;
  
  @Column({
    unique:false,
    nullable:true,
    enum:PhoneNumberVerification,
    default:PhoneNumberVerification.PENDING
  })
  phoneNumberVerification: string;

  @Column({
    unique:false,
    nullable:true,
    enum:ProfileSetup,
    default:ProfileSetup.PENDING
  })
  profileSetup: string;

  @OneToMany(()=>Order,order=>order.client)
  orders:Order[]
}
