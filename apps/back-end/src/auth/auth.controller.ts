import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
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

  // @Roles(UserRole.SUPER_ADMIN)
  // @Get('profile')
  // profile() {
  //   return {
  //     message: 'profile page',
  //   };
  // }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Request() req, @Body() body) {
    console.log('body', body);
    console.log(
      'auth.controle : we hare hitting the refresh token in the server',
    );
    // console.log(req.user.id, req.user.email, req.user.full_name, req.user.role);
    return this.authService.refreshToken(req.user.id, body.browserSessionID);
  }

  @Public()
  @Delete('logout/:userID/:browserSessionID')
  logout(
    @Param('userID') user_id: string,
    @Param('browserSessionID') browserSessionID: number,
  ) {
    const userID = parseInt(user_id, 10);
    return this.authService.logout(userID, browserSessionID);
  }

  @Get('check-access')
  checkAccess() {
    return 'Access Granted';
  }

  // FORGOT PASSWORD
  @Public()
  @Post('forgot-password')
  forgotPassword(@Request() req) {
    return this.authService.forgotPassword(req.body.email);
  }

  @Public()
  @Patch('reset-password')
  resetPassword(@Request() req) {
    return this.authService.resetPassword(req.body.token, req.body.password);
  }
}
