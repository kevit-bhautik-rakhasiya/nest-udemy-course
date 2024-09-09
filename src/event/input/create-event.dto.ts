import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'The name lengh is less than 5.' })
  name: string;
  @Length(5, 255, { message: 'Description lengh is less than 5.' })
  description: string;
  @IsDateString()
  when: string;
  @Length(5, 255, {
    message: 'Address must provide more than 5 character.',
  })
  address: string;
}
