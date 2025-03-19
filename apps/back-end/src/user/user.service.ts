import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { Database } from 'src/drizzle/types/drizzle';
import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';
import { users } from 'src/drizzle/schema/users.schema';
import { hash } from 'argon2';
import { FirstSuperAdminDto } from './dto/first-super-admin.dto';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashPassword = await hash(password);
    return await this.db
      .insert(users)
      .values({ ...user, password: hashPassword });
  }

  // Find if the email exists
  async findOneByEmail(email: string) {
    return await this.db
      .selectDistinct({ email: users.email })
      .from(users)
      .where(eq(users.email, email));
  }

  // COUNT ALL USERS
  async countAllUsers() {
    return await this.db.$count(users);
  }

  async setupRegistration(firstSuperAdminDto: FirstSuperAdminDto) {
    const { password, ...user } = firstSuperAdminDto;
    const hashPassword = await hash(password);
    return await this.db
      .insert(users)
      .values({ ...user, password: hashPassword, role: 'SUPER_ADMIN' });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
