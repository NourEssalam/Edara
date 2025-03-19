import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FirstSuperAdminDto } from 'src/user/dto/first-super-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get('users/count')
  // async getUserCount() {
  //   const count = await this.userService.countUsers();
  //   return { count };
  // }

  // This endpoint is for setting up the first super admin
  @Post('setup')
  setupFirstAdmin(@Body() firstSuperAdminDto: FirstSuperAdminDto) {
    return this.authService.setupRegistration(firstSuperAdminDto);
  }

  // this endpoint is for registering a new user by a super admin
  @Post('register')
  registerNewUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerNewUser(createUserDto);
  }
}
