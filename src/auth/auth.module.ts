import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LocalStrategy } from './local.stretagy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStretagy } from './jwt.streragy';
import { UserController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [LocalStrategy, JwtStretagy, AuthService],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
