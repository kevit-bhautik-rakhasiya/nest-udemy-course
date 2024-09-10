import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = new User();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Password are not identical']);
    }
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { password: createUserDto.password },
      ],
    });

    if (existingUser) {
      throw new BadRequestException(['username and email already taken']);
    }

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.firstname = createUserDto.firstname;
    user.lastname = createUserDto.lastname;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getjwtTokenForUser(user),
    };
  }
}
