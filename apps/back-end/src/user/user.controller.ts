import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@repo/shared-types';
import { GetUsersQueryDto } from './dto/query-users-list.dto';
import { UpdateUserBySuperAdminDto } from './dto/update-user.dto';
import { EditUserProfileDto } from './dto/edit-user-profile-info.dto';
import { ChangePasswordDto } from './dto/change-password-by-user.dto';
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
  @Roles(UserRole.SUPER_ADMIN)
  @Get('users-client-side')
  async getAllUsersClient() {
    const users = await this.userService.getAllUsersClient();
    return users;
  }

  @Get('get-user/:id')
  async getUserById(@Param('id') id: string) {
    const userId = parseInt(id, 10); // Convert to number
    return await this.userService.getUserById(userId);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Patch('update-user-by-super-admin/:id')
  async updateUserBySuperAdmin(
    @Param('id') id: string,
    @Body() updateUserBySuperAdminDto: UpdateUserBySuperAdminDto,
  ) {
    const userId = parseInt(id, 10); // Convert to number
    console.log('updating user by super admin');
    return await this.userService.updateUserBySuperAdmin(
      userId,
      updateUserBySuperAdminDto,
    );
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete('delete-user-by-super-admin/:id')
  async deleteUserBySuperAdmin(@Param('id') id: string) {
    const userId = parseInt(id, 10); // Convert to number
    return await this.userService.deleteUserBySuperAdmin(userId);
  }

  // Then dynamic endpoints
  // @Public()
  @Get('find-user/:id')
  async findOne(@Param('id') id: string) {
    // Note: URL params come as strings
    const userId = parseInt(id, 10); // Convert to number
    return await this.userService.findOneById(userId);
  }

  // @Public()
  @Get('get-user-profile-info/:id')
  async getUserProfileInfo(@Param('id') id: number) {
    // const userId = parseInt(id, 10); // Convert to number
    return await this.userService.getUserProfileInfo(id);
  }

  @Public()
  @Get('count-super-admins')
  async countSuperAdmins() {
    return await this.userService.countSuperAdmins();
  }

  @Patch('update-user-profile-info/:id')
  async updateUserProfileInfo(
    @Param('id') id: string,
    @Body() editUserProfileDto: EditUserProfileDto,
  ) {
    const userId = parseInt(id, 10); // Convert to number
    return await this.userService.editUserProfileInfo(
      userId,
      editUserProfileDto,
    );
  }

  @Patch('change-password-by-self/:id')
  async changePasswordBySelf(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = parseInt(id, 10); // Convert to number
    return await this.userService.changePasswordBySelf(
      userId,
      changePasswordDto,
    );
  }

  // for requests
  @Roles(UserRole.WORK_CERTIFICATION_ADMIN, UserRole.LEAVE_ADMIN)
  @Get('get-all-users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Roles(UserRole.WORK_CERTIFICATION_ADMIN, UserRole.LEAVE_ADMIN)
  @Get('user-of-request/:id')
  async getUserOfRequest(@Param('id') id: string) {
    const userId = parseInt(id, 10); // Convert to number
    return await this.userService.getUserOfRequest(userId);
  }
}
