import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne
} from "typeorm";
import { Partner } from "./partners.entity";

@Entity({ name: "individuals" })
export class Individual extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  @Column({
    unique: true,
    nullable: false,
  })
  uuid: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return { ...this, id: undefined };
  }
}
