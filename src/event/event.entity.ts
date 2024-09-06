import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(
    () => Attendee,
    (attendee) => attendee.event,
    // { eager: true }
    { cascade: true },
  )
  attendees: Attendee[];

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  atttendes: AttendeeAnswerEnum;
}
