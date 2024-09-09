import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from 'src/auth/user.entity';

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

  @ManyToOne(() => User, (user) => user.organized)
  organizer: User;

  //below all the properties are virtual not store in the database
  attendeeCount?: number;
  attendeeAccepted?: number;
  attendeeMaybe?: number;
  attendeeRejected?: number;
}
