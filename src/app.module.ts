import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EntitiesModuleModule } from './entities-config/entities-module.module';
import { MacsService } from './services/macs.service';
import { repositoryProviders } from './Repos.providers';
import { AdminController } from './admin.controller';
import { HttpModule } from './http.module';
import { UDMProService } from './services/udmpro.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    EntitiesModuleModule,
    HttpModule,
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
