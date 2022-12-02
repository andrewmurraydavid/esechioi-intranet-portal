import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EntitiesModuleModule } from './entities-config/entities-module.module';
import { MacsService } from './services/macs.service';
import { repositoryProviders } from './Repos.providers';
import { AdminController } from './admin.controller';
import { HttpModule } from '@nestjs/axios';
import { UDMProService } from './services/udmpro.service';
import * as https from 'https';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    EntitiesModuleModule,
    HttpModule.register({
      timeout: 5000,
      baseURL: `https://${process.env.UDM_IP}/proxy/network/api/`,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }),
  ],
  controllers: [AppController, AdminController],
  providers: [
    ...repositoryProviders,
    AppService,
    MacsService,
    UDMProService,
    UsersService,
  ],
})
export class AppModule {}
