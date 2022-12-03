import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('options', { schema: 'radius' })
export class Options {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 200, nullable: false })
  name: string;

  @Column('varchar', { name: 'value', length: 64, nullable: false })
  value: string;
}
