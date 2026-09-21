import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';



import { Role } from '../enum/role.enum.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
   id: string;

  @Column({ unique: true })
   email: string;

  @Column({ select: false })
   password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
   roles: Role[];

  @Column({ default: true })
   isActive: boolean;

  @CreateDateColumn()
   createdAt: Date;

  @UpdateDateColumn()
   updatedAt: Date;


}