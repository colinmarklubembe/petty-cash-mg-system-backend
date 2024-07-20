import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Requisition } from "./Requisition";

@Entity()
export class Approval {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  status!: string;

  @Column({ nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @ManyToOne(() => User, (user) => user.approvals)
  approvedBy?: User;

  @ManyToOne(() => Requisition, (requisition) => requisition.approvals)
  requisition?: Requisition;
}
