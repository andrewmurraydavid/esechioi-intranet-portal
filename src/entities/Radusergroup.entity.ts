import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('username', ['username'], {})
@Entity('radusergroup', { schema: 'radius' })
export class Radusergroup {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'username', length: 64, default: () => "''" })
  username: string;

  @Column('varchar', { name: 'groupname', length: 64, default: () => "''" })
  groupname: string;

  @Column('int', { name: 'priority', default: () => "'1'" })
  priority: number;
}
