import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventService } from './event.sevice';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  providers: [EventService],
  controllers: [EventsController],
})
export class EventModule {}
