import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { Database } from 'src/drizzle/types/drizzle';
import { CreateUserDto } from './dto/create-user.dto';
import {
  eq,
  like,
  or,
  sql,
  asc,
  desc,
  and,
  SQL,
  getTableColumns,
  count,
} from 'drizzle-orm';
import { users } from 'src/drizzle/schema/users.schema';
import { hash } from 'argon2';
import { FirstSuperAdminDto } from './dto/first-super-admin.dto';
import { GetUsersQueryDto } from './dto/query-users-list.dto';
import { UpdateUserBySuperAdminDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

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

  async createNewUser(createUserDto: CreateUserDto) {
    console.log('user.service : create new user', createUserDto);
    const { password, ...user } = createUserDto;
    const hashPassword = await hash(password);
    return await this.db
      .insert(users)
      .values({ ...user, password: hashPassword });
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

  async updatePassword(userId: number, hashPassword: string) {
    return await this.db
      .update(users)
      .set({ password: hashPassword })
      .where(eq(users.id, userId));
  }

  async getUserById(userId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashed_refresh_token, password, ...rest } = getTableColumns(users);
    return await this.db
      .select({ ...rest })
      .from(users)
      .where(eq(users.id, userId));
  }

  async updateUserBySuperAdmin(
    userId: number,
    updateUserBySuperAdminDto: UpdateUserBySuperAdminDto,
  ) {
    return await this.db
      .update(users)
      .set({ ...updateUserBySuperAdminDto, updated_at: new Date() })
      .where(eq(users.id, userId));
  }

  async deleteUserBySuperAdmin(userId: number) {
    return await this.db.delete(users).where(eq(users.id, userId));
  }

  ///////////////////////
  //////// GET ALL USERS
  ///////////////////////

  async getAllUsersClient() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashed_refresh_token, password, ...rest } = getTableColumns(users);
    return await this.db.select({ ...rest }).from(users);
  }

  async getAllUsersServer(options: GetUsersQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      roleFilter,
      statusFilter,
      sortByColumn = 'created_at',
      sortOrder = 'desc',
    } = options;

    // Now make sure these are numbers
    const numericLimit = Number(5) || 10;
    const numericPage = Number(page) || 1;
    const offset = (numericPage - 1) * numericLimit;

    const filters: SQL[] = []; // Initialize filters with an empty SQL array
    if (search) {
      const fullNameFilter = like(users.full_name, `%${search}%`);
      const emailFilter = like(users.email, `%${search}%`);
      filters.push(or(fullNameFilter, emailFilter) as SQL);
    }

    if (roleFilter) {
      filters.push(eq(users.role, roleFilter));
    }

    if (statusFilter) {
      filters.push(eq(users.status, statusFilter));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashed_refresh_token, password, ...rest } = getTableColumns(users);

    const sq = this.db.$with('sq').as(
      this.db
        .select({
          ...rest,
        })
        .from(users)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(() => {
          // Handle the dynamic column sorting properly
          const column = users[sortByColumn];
          return sortOrder === 'asc' ? asc(column) : desc(column);
        }),
    );

    const totalQuery = await this.db
      .with(sq)
      .select({ count: count(users.id) })
      .from(sq);
    const totalCount = totalQuery.length > 0 ? totalQuery[0]?.count : 0;

    const data = await this.db
      .with(sq)
      .select()
      .from(sq)
      .limit(numericLimit)
      .offset(offset);

    return {
      data,
      meta: {
        total: totalCount,
        // page: offset !== undefined ? Math.floor(offset / limit) + 1 : page,
        page: numericPage,
        limit: numericLimit,
        totalPages: Math.ceil((totalCount ?? 0) / numericLimit),
        hasNextPage: limit * numericPage < (totalCount ?? 0),
        hasPreviousPage: offset !== undefined ? offset > 0 : numericPage > 1,
      },
    };
  }

  async updateLastLoginTime(userId: number) {
    return await this.db
      .update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, userId));
  }
}
