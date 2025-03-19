import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { Database } from 'src/drizzle/types/drizzle';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FirstSuperAdminDto } from 'src/user/dto/first-super-admin.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly userService: UserService,
  ) {}

  async registerNewUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findOneByEmail(createUserDto.email);
    if (user[0]) {
      throw new ConflictException('User already exists');
    }
    return this.userService.create(createUserDto);
  }

  async setupRegistration(firstSuperAdminDto: FirstSuperAdminDto) {
    const usersCount = await this.userService.countAllUsers();
    if (usersCount)
      throw new ConflictException('setup is already done for this app');
    return this.userService.setupRegistration(firstSuperAdminDto);
  }
}
