import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class Model extends BaseEntity {
  @PrimaryGeneratedColumn()
  id:  | undefined ;

  @Generated("uuid")
  @Column({
    unique: true,
    nullable: false,
  })
  uuid: string | undefined ;

  @CreateDateColumn()
  createdAt: Date | undefined ;

  @UpdateDateColumn()
  updatedAt: Date | undefined ;

  toJSON() {
    return { ...this, id: undefined };
  }
}
