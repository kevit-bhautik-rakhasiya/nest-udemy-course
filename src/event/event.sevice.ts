import { Injectable, Logger } from '@nestjs/common';
import { AttendeeAnswerEnum, Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventService {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(Event)
    private readonly eventRepositary: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventRepositary.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  private getAttendeCountBaseQuary() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeReject',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  public async getEvent(id: number): Promise<Event> {
    const event = await this.getAttendeCountBaseQuary().andWhere('e.id = :id', {
      id,
    });

    this.logger.warn(event.getSql());

    return await event.getOne();
  }
}
