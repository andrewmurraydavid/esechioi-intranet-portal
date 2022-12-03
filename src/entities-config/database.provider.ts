import { DataSource } from 'typeorm';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Macs } from 'src/entities/Macs.entity';
import { Nas } from 'src/entities/Nas.entity';
import { Radacct } from 'src/entities/Radacct.entity';
import { Radcheck } from 'src/entities/Radcheck.entity';
import { Radgroupcheck } from 'src/entities/Radgroupcheck.entity';
import { Radgroupreply } from 'src/entities/Radgroupreply.entity';
import { Radpostauth } from 'src/entities/Radpostauth.entity';
import { Radreply } from 'src/entities/Radreply.entity';
import { Radusergroup } from 'src/entities/Radusergroup.entity';
import { Users } from 'src/entities/Users.entity';
import { Options } from 'src/entities/Options.entity';

export const databaseProviders = [
  {
    provide: 'MYSQL_CONNECTION',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
        logging: true,
        entities: [
          Macs,
          Radacct,
          Nas,
          Radcheck,
          Radgroupcheck,
          Radgroupreply,
          Radpostauth,
          Radreply,
          Radusergroup,
          Users,
          Options
        ],
      });

      return dataSource.initialize();
    },
  },
];
