import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './event/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event/event.entity';
import { EventModule } from './event/event.module';
import { AppJapanesService } from './app.japanes.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Event],
      synchronize: true,
    }),
    EventModule,
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
