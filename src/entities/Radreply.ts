import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('username', ['username'], {})
@Entity('radreply', { schema: 'radius' })
export class Radreply {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'username', length: 64, default: () => "''" })
  username: string;

  @Column('varchar', { name: 'attribute', length: 64, default: () => "''" })
  attribute: string;

  @Column('char', { name: 'op', length: 2, default: () => "'='" })
  op: string;

  @Column('varchar', { name: 'value', length: 253, default: () => "''" })
  value: string;
}
