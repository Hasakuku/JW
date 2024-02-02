import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth_code')
export class AuthCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  email: string;

  @Column('int')
  code: number;

  @Column('timestamp')
  expirationTime: Date;
}
