import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EntitiesModuleModule } from './entities-module/entities-module.module';
import { GraphQlModule } from './graph-ql/graph-ql.module';
import { MacsResolver } from './macs/macs.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    EntitiesModuleModule,
    GraphQlModule,
  ],
  controllers: [AppController],
  providers: [AppService, MacsResolver],
})
export class AppModule {}
