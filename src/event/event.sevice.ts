import { Injectable, Logger } from '@nestjs/common';
import { Event } from './event.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { paginate, PaginateOptions } from './pagination/paginator';
import { CreateEventDto } from './input/create-event.dto';
import { User } from 'src/auth/user.entity';
import { UpdateEventDto } from './input/update-event.dto';

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

  private async getEventsWithAttendeeCountFilter(filter: ListEvents) {
    let query = this.getEventsBaseQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
        );
      }
      if (filter.when == WhenEventFilter.Tommorow) {
        query = query.andWhere(
          `e.when >=CURDATE() + INTERVAL 1 DAY AND e.when<=CURDATE() + INTERVAL 2 DAY`,
        );
      }
      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere(`YEARWEEK(e.when ,1 )= YEARWEEK(CURDATE() , 1)`);
      }
      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere(
          `YEARWEEK(e.when ,1 )=YEARWEEK(CURDATE() , 1)+1`,
        );
      }
    }
    return query;
  }

  public async getEventsWithAttendeeCountFilterdPagination(
    filter: ListEvents,
    paginationOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFilter(filter),
      paginationOptions,
    );
  }

  public async getEvent(id: number): Promise<Event> {
    const event = await this.getAttendeCountBaseQuary().andWhere('e.id = :id', {
      id,
    });
    // this.logger.warn(event.getSql());
    return await event.getOne();
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return await this.eventRepositary.save({
      ...input,
      organizer: user,
      when: new Date(input.when),
    });
  }

  public async updateEvent(
    event: Event,
    input: UpdateEventDto,
  ): Promise<Event> {
    return await this.eventRepositary.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return this.eventRepositary
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
