import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";

@Entity()
export class PettyCashFund {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column("float")
  currentBalance!: number;

  @Column("float")
  totalSpent!: number;

  @Column("float")
  totalAdded!: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.pettyCashFunds)
  user?: User;

  @OneToMany(() => Transaction, (transaction) => transaction.pettyCashFund)
  transactions?: Transaction[];
}
