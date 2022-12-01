import { DataSource } from 'typeorm';
import { Macs } from './entities/Macs.entity';
import { Nas } from './entities/Nas.entity';
import { Radacct } from './entities/Radacct.entity';
import { Radcheck } from './entities/Radcheck.entity';
import { Radpostauth } from './entities/Radpostauth.entity';
import { Radreply } from './entities/Radreply.entity';
import { Users } from './entities/Users.entity';

export const repositoryProviders = [
  {
    provide: 'MACS_REPOSITORY',
    useFactory: (conn: DataSource) => conn.getRepository(Macs),
    inject: ['MYSQL_CONNECTION'],
  },
  {
    provide: 'NAS_REPOSITORY',
    useFactory: (conn: DataSource) => conn.getRepository(Radcheck),
    inject: ['MYSQL_CONNECTION'],
  },
  {
    provide: 'NAS_REPOSITORY',
    useFactory: (conn: DataSource) => conn.getRepository(Nas),
    inject: ['MYSQL_CONNECTION'],
  },
  {
    provide: 'RADACCT_REPOSITORY',
    useFactory: (conn: DataSource) => conn.getRepository(Radacct),
    inject: ['MYSQL_CONNECTION'],
  },
  {
    provide: 'RADPOSTAUTH_REPOSITORY',
    useFactory: (conn: DataSource) => conn.getRepository(Radpostauth),
    inject: ['MYSQL_CONNECTION'],
  },
  {
    provide: 'NAS_REPOSITORY',
    useFactory: (conn: DataSource) => conn.getRepository(Radreply),
    inject: ['MYSQL_CONNECTION'],
  },
  {
    provide: 'USERS_REPOSITORY',
    useFactory: (conn: DataSource) => conn.getRepository(Users),
    inject: ['MYSQL_CONNECTION'],
  },
];
