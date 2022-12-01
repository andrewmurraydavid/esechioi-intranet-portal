import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('acctuniqueid', ['acctuniqueid'], { unique: true })
@Index('username', ['username'], {})
@Index('framedipaddress', ['framedipaddress'], {})
@Index('framedipv6address', ['framedipv6address'], {})
@Index('framedipv6prefix', ['framedipv6prefix'], {})
@Index('framedinterfaceid', ['framedinterfaceid'], {})
@Index('delegatedipv6prefix', ['delegatedipv6prefix'], {})
@Index('acctsessionid', ['acctsessionid'], {})
@Index('acctsessiontime', ['acctsessiontime'], {})
@Index('acctstarttime', ['acctstarttime'], {})
@Index('acctinterval', ['acctinterval'], {})
@Index('acctstoptime', ['acctstoptime'], {})
@Index('nasipaddress', ['nasipaddress'], {})
@Entity('radacct', { schema: 'radius' })
export class Radacct {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'radacctid' })
  radacctid: string;

  @Column('varchar', { name: 'acctsessionid', length: 64, default: () => "''" })
  acctsessionid: string;

  @Column('varchar', {
    name: 'acctuniqueid',
    unique: true,
    length: 32,
    default: () => "''",
  })
  acctuniqueid: string;

  @Column('varchar', { name: 'username', length: 64, default: () => "''" })
  username: string;

  @Column('varchar', {
    name: 'realm',
    nullable: true,
    length: 64,
    default: () => "''",
  })
  realm: string | null;

  @Column('varchar', { name: 'nasipaddress', length: 15, default: () => "''" })
  nasipaddress: string;

  @Column('varchar', { name: 'nasportid', nullable: true, length: 32 })
  nasportid: string | null;

  @Column('varchar', { name: 'nasporttype', nullable: true, length: 32 })
  nasporttype: string | null;

  @Column('datetime', { name: 'acctstarttime', nullable: true })
  acctstarttime: Date | null;

  @Column('datetime', { name: 'acctupdatetime', nullable: true })
  acctupdatetime: Date | null;

  @Column('datetime', { name: 'acctstoptime', nullable: true })
  acctstoptime: Date | null;

  @Column('int', { name: 'acctinterval', nullable: true })
  acctinterval: number | null;

  @Column('int', { name: 'acctsessiontime', nullable: true, unsigned: true })
  acctsessiontime: number | null;

  @Column('varchar', { name: 'acctauthentic', nullable: true, length: 32 })
  acctauthentic: string | null;

  @Column('varchar', { name: 'connectinfo_start', nullable: true, length: 50 })
  connectinfoStart: string | null;

  @Column('varchar', { name: 'connectinfo_stop', nullable: true, length: 50 })
  connectinfoStop: string | null;

  @Column('bigint', { name: 'acctinputoctets', nullable: true })
  acctinputoctets: string | null;

  @Column('bigint', { name: 'acctoutputoctets', nullable: true })
  acctoutputoctets: string | null;

  @Column('varchar', {
    name: 'calledstationid',
    length: 50,
    default: () => "''",
  })
  calledstationid: string;

  @Column('varchar', {
    name: 'callingstationid',
    length: 50,
    default: () => "''",
  })
  callingstationid: string;

  @Column('varchar', {
    name: 'acctterminatecause',
    length: 32,
    default: () => "''",
  })
  acctterminatecause: string;

  @Column('varchar', { name: 'servicetype', nullable: true, length: 32 })
  servicetype: string | null;

  @Column('varchar', { name: 'framedprotocol', nullable: true, length: 32 })
  framedprotocol: string | null;

  @Column('varchar', {
    name: 'framedipaddress',
    length: 15,
    default: () => "''",
  })
  framedipaddress: string;

  @Column('varchar', {
    name: 'framedipv6address',
    length: 45,
    default: () => "''",
  })
  framedipv6address: string;

  @Column('varchar', {
    name: 'framedipv6prefix',
    length: 45,
    default: () => "''",
  })
  framedipv6prefix: string;

  @Column('varchar', {
    name: 'framedinterfaceid',
    length: 44,
    default: () => "''",
  })
  framedinterfaceid: string;

  @Column('varchar', {
    name: 'delegatedipv6prefix',
    length: 45,
    default: () => "''",
  })
  delegatedipv6prefix: string;
}
