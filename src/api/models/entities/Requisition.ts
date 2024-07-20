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
import { Approval } from "./Approval";
import { RequisitionStatus } from "../enums/RequisitionStatus";

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

  @OneToMany(() => Approval, (approval) => approval.requisition)
  approvals?: Approval[];
}
