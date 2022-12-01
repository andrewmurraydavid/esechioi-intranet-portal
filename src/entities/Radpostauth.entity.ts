import { Column, DataSource, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('username', ['username'], {})
@Entity('radpostauth', { schema: 'radius' })
export class Radpostauth {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', length: 64, default: () => "''" })
  username: string;

  @Column('varchar', { name: 'pass', length: 64, default: () => "''" })
  pass: string;

  @Column('varchar', { name: 'reply', length: 32, default: () => "''" })
  reply: string;

  @Column('timestamp', {
    name: 'authdate',
    default: () => "'current_timestamp(6)'",
  })
  authdate: Date;
}
