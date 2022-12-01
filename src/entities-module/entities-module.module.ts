import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Macs } from 'src/entities/Macs';
import { Nas } from 'src/entities/Nas';
import { Radacct } from 'src/entities/Radacct';
import { Radcheck } from 'src/entities/Radcheck';
import { Radgroupcheck } from 'src/entities/Radgroupcheck';
import { Radgroupreply } from 'src/entities/Radgroupreply';
import { Radpostauth } from 'src/entities/Radpostauth';
import { Radreply } from 'src/entities/Radreply';
import { Radusergroup } from 'src/entities/Radusergroup';

// import

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
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
      ],
      autoLoadEntities: true,
      // synchronize: true,
    }),
  ],
})
export class EntitiesModuleModule {}
