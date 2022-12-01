import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('groupname', ['groupname'], {})
@Entity('radgroupreply', { schema: 'radius' })
export class Radgroupreply {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'groupname', length: 64, default: () => "''" })
  groupname: string;

  @Column('varchar', { name: 'attribute', length: 64, default: () => "''" })
  attribute: string;

  @Column('char', { name: 'op', length: 2, default: () => "'='" })
  op: string;

  @Column('varchar', { name: 'value', length: 253, default: () => "''" })
  value: string;
}
