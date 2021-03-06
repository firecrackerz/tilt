import { Exclude } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../../../types/roles";
import { Activity } from "./activity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsEmail()
  @Column({ unique: true })
  public email!: string;

  @Exclude({ toPlainOnly: true })
  @IsString()
  @MinLength(6)
  @Column({ select: false })
  public password!: string;

  @Column()
  public verifyToken!: string;

  @Column()
  public createdAt!: Date;

  @Column()
  public updatedAt!: Date;

  @OneToMany(() => Activity, (activity) => activity.user)
  public activity!: Activity[];

  @Column()
  public role!: UserRole;
}

/**
 * Removes all private fields from a given user.
 * @param user The user to clean
 */
export const deletePrivateUserFields = (user: User): User => {
  delete user.password;
  delete user.verifyToken;

  return user;
};
