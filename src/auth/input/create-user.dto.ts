import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(5)
  username: string;

  @Length(8)
  password: string;

  @Length(8)
  retypedPassword: string;

  @Length(2)
  firstname: string;
  @Length(2)
  lastname: string;

  @IsEmail()
  email: string;
}
