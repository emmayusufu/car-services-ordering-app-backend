import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

Entity({ name: "individuals" });
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJson() {
    return { ...this, id: undefined };
  }
}
