import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

export enum RequisitionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity()
export class Requisition {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  title!: string;

  @Column()
  description?: string;

  @Column("float")
  amount!: number;

  @Column({
    type: "enum",
    enum: RequisitionStatus,
    default: RequisitionStatus.PENDING,
  })
  status!: RequisitionStatus;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.requisitions)
  user?: User;
}
