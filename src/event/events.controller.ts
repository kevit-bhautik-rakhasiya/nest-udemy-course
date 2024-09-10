import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EventService } from './event.sevice';
import { ListEvents } from './input/list.events';
import { User } from 'src/auth/user.entity';
import { currentUser } from 'src/auth/current-user.decorator';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name); // Create an Instance of logger class

  constructor(private readonly eventService: EventService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug('Hit and run findAll');
    const event =
      await this.eventService.getEventsWithAttendeeCountFilterdPagination(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 10,
        },
      );
    return event;
  }

  // @Get('/practice')
  // async practice() {
  //   return await this.repositary.find({
  //     where: [
  //       {
  //         id: MoreThan(3),
  //         when: MoreThan(new Date('2021-02-12T13:00:00')),
  //       },
  //       {
  //         description: Like('%meet%'),
  //       },
  //     ],
  //     take: 10, //Set to Limit
  //     order: {
  //       id: 'ASC',
  //     },
  //   });
  // }

  // @Get('/practice2')
  // async practice2() {
  //   // return await this.repositary.findOne({
  //   //   where: { id: 1 },
  //   //   relations: ['attendees'],
  //   // });

  //   const event = await this.repositary.findOne({
  //     where: { id: 1 },
  //     relations: ['attendees'],
  //   });

  //   // const event = new Event();
  //   // event.id = 1;

  //   const attende = new Attendee();
  //   attende.name = 'using cascade function';
  //   // attende.event = event;

  //   event.attendees.push(attende);
  //   // console.log(add);

  //   // await this.attendeeRepositary.save(attende);
  //   await this.repositary.save(event);

  //   return event;
  // }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDto, @currentUser() user: User) {
    return await this.eventService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id') id,
    @Body() input: UpdateEventDto,
    @currentUser() user: User,
  ) {
    const event = await this.eventService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }
    if (user.id !== event.organizerId) {
      throw new ForbiddenException(
        null,
        `You ae not authorize to chenge this events`,
      );
    }

    return await this.eventService.updateEvent(event, input);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async delete(@Param('id') id, @currentUser() user: User) {
    const event = await this.eventService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }
    if (user.id !== event.organizerId) {
      throw new ForbiddenException(
        null,
        `You ae not authorize to remove this events`,
      );
    }
    await this.eventService.deleteEvent(id);
  }
}
