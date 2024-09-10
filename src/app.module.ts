import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from './event/event.module';
import { AppJapanesService } from './app.japanes.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    AuthModule,
    EventModule,
    SchoolModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppJapanesService,
    },
    {
      provide: 'MY_APP', //provider name in string "It is value provider"
      useValue: 'Backend Nest Property!', // this value provides above provider
    },
    {
      provide: 'MESSAGE', //It is factory provider
      inject: [AppDummy],
      useFactory: (app) => `${app.dummy()} Factory@@`,
    },
    AppDummy,
  ],
})
export class AppModule {}
