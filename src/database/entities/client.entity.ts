import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Generated } from "typeorm";

@Entity({name:"clients"})
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  uuid:string

  @Column()
  firstName: string;
  
  @Column()
  lastName: string;
  
  @Column()
  phoneNumber: string;
}
