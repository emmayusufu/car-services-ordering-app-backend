import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { PhoneNumberVerification, ProfileSetup } from "../../enums/enums";

@Entity({ name: "clients" })
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  @Column({
    unique:true,
    nullable:false
  })
  uuid: string;
 
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date; 

  toJSON() {
    return { ...this, id: undefined };
  }
}
