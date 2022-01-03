import { Column, Entity } from "typeorm";
import { OrderStatus } from "../../enums/enums";
import { Client } from "./clients.entity";
import { Model } from "./model";
import { Partner } from "./partners.entity";

@Entity({ name: "orders" })
export class Order extends Model {
  @Column({
    unique: false,
    nullable: false,
  })
  client: Client;

  @Column({
    unique: false,
    nullable: false,
  })
  partner: Partner;

  @Column({
    unique: false,
    nullable: false,
  })
  type: string;

  @Column({
    unique: false,
    nullable: false,
    enum: OrderStatus,
  })
  status: string;
}
