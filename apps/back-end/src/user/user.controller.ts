import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@repo/shared-types';
import { GetUsersQueryDto } from './dto/query-users-list.dto';
// import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('count')
  async countAllUsers() {
    return await this.userService.countAllUsers();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   // Note: URL params come as strings
  //   const userId = parseInt(id, 10); // Convert to number
  //   return await this.userService.findOneById(userId);
  // }

  @Roles(UserRole.SUPER_ADMIN)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findEmail(createUserDto.email);
    if (user[0]) {
      throw new ConflictException('المستخدم موجود بالفعل');
    }
    return await this.userService.createNewUser(createUserDto);
  }

  // GET ALL USERS BUT WITH SERVER SIDE PAGINAION AND FILTRATION
  // @Roles(UserRole.SUPER_ADMIN)

  @Get('users-server-side')
  async getAllUsersServer(@Query() queryDto: GetUsersQueryDto) {
    const users = await this.userService.getAllUsersServer(queryDto);
    return users;
  }

  // Get allusers and let tanstack do the pagination and filtration
  @Get('users-client-side')
  async getAllUsersClient() {
    const users = await this.userService.getAllUsersClient();
    return users;
  }

  // Then dynamic endpoints
  @Public()
  @Get('find-user/:id')
  async findOne(@Param('id') id: string) {
    // Note: URL params come as strings
    const userId = parseInt(id, 10); // Convert to number
    return await this.userService.findOneById(userId);
  }
}
