import { Column, Entity, ManyToOne } from "typeorm";
import { OrderStatus } from "../../enums/enums";
import { Client } from "./clients.entity";
import { Model } from "./model";
import { Partner } from "./partners.entity";

@Entity({ name: "orders" })
export class Order extends Model {
  @ManyToOne(() => Client, (client) => client.orders)
  client: Client | undefined ;

  @ManyToOne(() => Partner, (partner) => partner.orders)
  partner: Partner | undefined ;

  @Column({
    unique: false,
    nullable: false,
  })
  service: string | undefined ;

  @Column({
    unique: false,
    nullable: false,
    enum: OrderStatus,
  })
  status: string | undefined ;
}
