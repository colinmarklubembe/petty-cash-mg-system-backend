import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { IsEmail, IsBoolean } from "class-validator";
import { Role } from "../enums/Role";
import { Requisition } from "./Requisition";
import { PettyCashFund } from "./PettyCashFund";
import { Approval } from "./Approval";
import { Transaction } from "./Transaction";

@Entity()
@Unique(["email"])
export class User {
  @ObjectIdColumn({ name: "_id", unique: true, nullable: false })
  id!: ObjectId;

  @Column()
  @IsEmail()
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName!: string;

  @Column({ default: false })
  @IsBoolean()
  isVerified?: boolean;

  @Column({ nullable: true })
  verificationToken?: string;

  @Column({ nullable: true })
  forgotPasswordToken?: string;

  @Column({ default: false })
  @IsBoolean()
  isActivated!: boolean;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ type: "enum", enum: Role, default: Role.EMPLOYEE })
  role?: Role;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => Requisition, (requisition) => requisition.user, {
    eager: true,
  })
  requisitions?: Requisition[];

  @OneToMany(() => PettyCashFund, (pettyCashFund) => pettyCashFund.user)
  pettyCashFunds?: PettyCashFund[];

  @OneToMany(() => Approval, (approval) => approval.approvedBy)
  approvals?: Approval[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions?: Transaction[];
}
