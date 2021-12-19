import {
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    Entity,
    Generated,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  Entity({ name: "companies" });
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
        nullable:false,
        unique:false
    })
    companyName:string
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    toJson() {
        return { ...this, id: undefined };
      }
  }
  