import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { PettyCashFund } from "./PettyCashFund";

@Entity()
export class Transaction {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column("float")
  amount!: number;

  @Column()
  type!: string; // e.g., "disbursement" or "replenishment"

  @CreateDateColumn()
  createdAt?: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  user?: User;

  @ManyToOne(() => PettyCashFund, (pettyCashFund) => pettyCashFund.transactions)
  pettyCashFund?: PettyCashFund;
}
