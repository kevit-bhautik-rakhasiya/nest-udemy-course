import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { currentUser } from './current-user.decorator';
import { User } from './user.entity';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@currentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getjwtTokenForUser(user),
    };
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@currentUser() user: User) {
    return user;
  }
}
