import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";
import { IsEmail, Length } from "class-validator";

@Entity()
export class User {
  @ObjectIdColumn({ name: "_id", unique: true, nullable: false })
  id: ObjectId | undefined;

  @Column()
  name: string | undefined;

  @Column()
  @IsEmail()
  email: string | undefined;

  @Column()
  @Length(6, 20)
  password: string | undefined;

  @Column()
  role: string | undefined;
}
