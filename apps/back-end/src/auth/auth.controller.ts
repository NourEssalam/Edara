import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FirstSuperAdminDto } from 'src/user/dto/first-super-admin.dto';
import { LocalAuthGuard } from './local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@repo/shared-types';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // This endpoint is for setting up the first super admin
  @Public()
  @Post('setup')
  setupFirstAdmin(@Body() firstSuperAdminDto: FirstSuperAdminDto) {
    return this.authService.setupRegistration(firstSuperAdminDto);
  }

  // this endpoint is for registering a new user by a super admin
  @Public()
  @Post('register')
  registerNewUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerNewUser(createUserDto);
  }

  // Login
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): unknown {
    // console.log('FULL USER OBJECT FROM LOGIN:', JSON.stringify(req.user));

    return this.authService.login(
      req.user.id,
      req.user.email,
      req.user.full_name,
      req.user.role,
    );
  }

  @Roles(
    UserRole.TEACHER,
    UserRole.GENERAL_STAFF,
    UserRole.CLASS_ATTENDANCE_ADMIN,
  )
  @Get('protected')
  getAll() {
    return {
      message: 'profile page',
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Request() req) {
    console.log(
      'auth.controle : we hare hitting the refresh token in the server',
    );
    return this.authService.refreshToken(
      req.user.id,
      req.user.email,
      req.user.full_name,
      req.user.role,
    );
  }

  @Post('logout')
  logout(@Request() req) {
    console.log('id from logout', req.user.id);
    return this.authService.logout(req.user.id);
  }

  @Get('check-access')
  checkAccess() {
    return 'Access Granted';
  }
}
