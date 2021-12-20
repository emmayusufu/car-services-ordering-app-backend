import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import {
  PartnerType,
  PhoneNumberVerification,
  ProfileSetup,
} from "../../enums/enums";
import { Company } from "./companies.entity";
import { Individual } from "./individuals.entity";

@Entity({ name: "partners" })
export class Partner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  @Column({
    unique: true,
    nullable: false,
  })
  uuid: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return { ...this, id: undefined };
  }
}
