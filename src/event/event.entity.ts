import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from 'src/auth/user.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  when: Date;

  @Column()
  @Expose()
  address: string;

  @OneToMany(
    () => Attendee,
    (attendee) => attendee.event,
    // { eager: true }
    { cascade: true },
  )
  @Expose()
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizerId' })
  @Expose()
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  //below all the properties are virtual not store in the database
  @Expose()
  attendeeCount?: number;
  @Expose()
  attendeeAccepted?: number;
  @Expose()
  attendeeMaybe?: number;
  @Expose()
  attendeeRejected?: number;
}
