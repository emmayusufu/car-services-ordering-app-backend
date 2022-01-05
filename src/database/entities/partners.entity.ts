import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import {
  PartnerType,
  PhoneNumberVerification,
  ProfileSetup,
} from "../../enums/enums";
import { Company } from "./companies.entity";
import { Individual } from "./individuals.entity";
import { Model } from "./model";
import { Order } from "./orders.entity";

@Entity({ name: "partners" })
export class Partner extends Model {
  @Column({
    unique: true,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    unique: false,
    enum: PhoneNumberVerification,
    default: PhoneNumberVerification.PENDING,
  })
  phoneNumberVerification: string;

  @Column({
    unique: false,
    nullable: true,
    enum: PartnerType,
  })
  partnerType: string;

  @Column({
    unique: false,
    nullable: true,
    enum: ProfileSetup,
    default: ProfileSetup.PENDING,
  })
  profileSetup: string;

  @OneToOne(() => Individual, (individual) => individual.partner)
  @JoinColumn()
  individualDetails: Individual;

  @OneToOne(() => Company, (company) => company.partner)
  @JoinColumn()
  companyDetails: Company;

  @OneToMany(() => Order, (order) => order.partner)
  orders: Order[];
}
