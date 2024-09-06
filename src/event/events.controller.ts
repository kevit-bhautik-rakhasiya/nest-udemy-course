import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repositary: Repository<Event>,
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    return await this.repositary.findOne({ where: { id: id } });
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
    return await this.repositary.remove(event);
  }
}
