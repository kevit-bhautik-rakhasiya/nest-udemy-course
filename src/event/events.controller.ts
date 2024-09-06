import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventService } from './event.sevice';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name); // Create an Instance of logger class

  constructor(
    @InjectRepository(Event)
    private readonly repositary: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepositary: Repository<Attendee>,

    private readonly eventService: EventService,
  ) {}
  @Get()
  async findAll() {
    return await this.repositary.find();
  }
  @Get('/practice')
  async practice() {
    return await this.repositary.find({
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 10, //Set to Limit
      order: {
        id: 'ASC',
      },
    });
  }

  @Get('/practice2')
  async practice2() {
    // return await this.repositary.findOne({
    //   where: { id: 1 },
    //   relations: ['attendees'],
    // });

    const event = await this.repositary.findOne({
      where: { id: 1 },
      relations: ['attendees'],
    });

    // const event = new Event();
    // event.id = 1;

    const attende = new Attendee();
    attende.name = 'using cascade function';
    // attende.event = event;

    event.attendees.push(attende);
    // console.log(add);

    // await this.attendeeRepositary.save(attende);
    await this.repositary.save(event);

    return event;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repositary.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repositary.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException();
    }
    return await this.repositary.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id) {
    const event = await this.repositary.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException();
    }
    return await this.repositary.remove(event);
  }
}
