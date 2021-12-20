import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Partner } from "./partners.entity";

@Entity({ name: "companies" })
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  @Column({
    unique: true,
    nullable: false,
  })
  uuid: string;

  @Column({
    nullable: false,
    unique: false,
  })
  companyName: string;

  @OneToOne(() => Partner, (partner) => partner.companyDetails)
  partner: Partner;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return { ...this, id: undefined };
  }
}
