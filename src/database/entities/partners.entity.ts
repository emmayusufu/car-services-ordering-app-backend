import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import {
  AccountType,
  AccountStatus,
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
  phoneNumber: string | undefined ;

  @Column({
    nullable: true,
    default:false
  })
  emergencyRescue: boolean | undefined ;

  @Column({
    nullable: true,
    default:false
  })
  carWash: boolean | undefined ;

  @Column({
    nullable: true,
    default:false
  })
  carServicing: boolean | undefined ;
 
  @Column({
    unique: false,
    nullable: true,
    enum: AccountType,
  })
  accountType: string | undefined ;
  
  @Column({
    unique: false,
    nullable: true,
    enum: ProfileSetup,
    default: ProfileSetup.PENDING,
  })
  profileSetup: string | undefined ;

  @Column({
    unique: false,
    nullable: true,
    enum: AccountStatus,
  })
  accountStatus: string | undefined ;

  @OneToOne(() => Individual, (individual) => individual.partner)
  @JoinColumn()
  individualDetails: Individual | undefined ;

  @OneToOne(() => Company, (company) => company.partner)
  @JoinColumn()
  companyDetails: Company | undefined ;

  @OneToMany(() => Order, (order) => order.partner)
  orders: Order[] | undefined ;
}
