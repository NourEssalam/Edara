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
  async findEmail(email: string) {
    return await this.db
      .selectDistinct({ email: users.email })
      .from(users)
      .where(eq(users.email, email));
  }

  async findOneByEmail(email: string) {
    return await this.db
      .selectDistinct()
      .from(users)
      .where(eq(users.email, email));
  }

  async findOneById(userId: number) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    // Add some logging to debug
    // console.log('Searching for user with ID:', userId);
    // console.log('Result:', result);

    return result.length > 0 ? result[0] : null; // Return first item or null
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

  async updateHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string | null,
  ) {
    console.log('user.service : update refresh token', hashedRefreshToken);
    return await this.db
      .update(users)
      .set({ hashed_refresh_token: hashedRefreshToken })
      .where(eq(users.id, userId));
  }
}
