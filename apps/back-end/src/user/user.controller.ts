import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('count')
  async countAllUsers() {
    return await this.userService.countAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Note: URL params come as strings
    const userId = parseInt(id, 10); // Convert to number
    return await this.userService.findOneById(userId);
  }
}
