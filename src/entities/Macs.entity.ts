import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('macs', { schema: 'radius' })
export class Macs {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Field()
  @Column('varchar', { name: 'username', length: 100 })
  username: string;

  @Field({ nullable: true })
  @Column('varchar', {
    name: 'callingstationid',
    length: 50,
    default: () => "'na'",
  })
  callingstationid: string;
}
