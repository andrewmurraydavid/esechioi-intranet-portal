import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('users', { schema: 'radius' })
export class Users {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Field()
  @Column('varchar', { name: 'username', length: 50 })
  username: string;

  @Field()
  @Column('varchar', { name: 'fullname', length: 50 })
  fullname: string;

  @Field({ nullable: true })
  @Column('varchar', {
    name: 'callingstationid',
    length: 50,
  })
  callingstationid: string;
}
