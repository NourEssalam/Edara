import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify, hash } from 'argon2';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { Database } from 'src/drizzle/types/drizzle';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FirstSuperAdminDto } from 'src/user/dto/first-super-admin.dto';
import { UserService } from 'src/user/user.service';
import { AuthJWTPayload } from './types/auth.jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@repo/shared-types';
import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config';

import crypto from 'crypto';
import { createHash } from 'crypto';
import { passwordResetTokens } from 'src/drizzle/schema/reset-password.schema';
import { eq } from 'drizzle-orm';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private emailService: EmailService,
  ) {}

  TODO;

  // this is possibly needs to be in the user service only, I WILL MOVE IT LATER
  async registerNewUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findEmail(createUserDto.email);
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

  // This is return the user object that the login method will take and append to the token
  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user[0])
      throw new UnauthorizedException('هذا البريد الإلكتروني غير مسجل');
    const isPasswordMatched = await verify(user[0].password, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('كلمة المرور غير صحيحة');

    return {
      id: user[0].id,
      email: user[0].email,
      full_name: user[0].full_name,
      role: user[0].role,
    };
  }

  async generateToken(userId: number, role: UserRole) {
    const payload: AuthJWTPayload = {
      sub: userId, // Make sure userId is actually a number here
      role: role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(
    userId: number,
    email: string,
    full_name: string,
    role: UserRole,
  ) {
    const { accessToken, refreshToken } = await this.generateToken(
      userId,
      role,
    );
    const hashRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashRefreshToken);

    return {
      id: userId,
      email,
      full_name,
      role,
      accessToken,
      refreshToken,
    };
  }

  // we doing this to make sure that the user is not deleted and can't just the access token that he received BEFORE the user was deleted
  // TODO : MAYBE WE NEED TO ADD THE USER STATUS LATER ON
  // we use this funtion in jwt guard (strategy)
  async validateJwtUser(userId: number) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new UnauthorizedException('oops user not found');
    // if (user.status === 'SUSPENDED')
    //   throw new UnauthorizedException('user is suspended');
    const currentuser = user ? { id: user.id, role: user.role } : null;
    return currentuser;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    // Find the user by ID
    const user = await this.userService.findOneById(userId);

    // Check if user exists
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify the refresh token
    try {
      const refreshTokenMatched = await verify(
        user.hashed_refresh_token ?? '',
        refreshToken,
      );

      // If token doesn't match, throw unauthorized exception
      if (!refreshTokenMatched) {
        throw new UnauthorizedException('Invalid Refresh Token');
      }
      console.log('refresh token is matched');

      // Return user identifier if token is valid
      const currentUser = { id: user.id };
      return currentUser;
    } catch (error) {
      // Log any verification errors
      console.error('Refresh token verification error:', error);
      // throw new UnauthorizedException('Invalid Refresh Token');
    }
  }

  async refreshToken(
    userId: number,
    email: string,
    full_name: string,
    role: UserRole,
  ) {
    const { accessToken, refreshToken } = await this.generateToken(
      userId,
      role,
    );
    const hashRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashRefreshToken);

    return {
      id: userId,
      email,
      full_name,
      role,
      accessToken,
      refreshToken,
    };
  }

  ////////////////////
  /// LOGOUT
  async logout(userId: number) {
    console.log('id from logout', userId);

    console.log('logout');
    return await this.userService.updateHashedRefreshToken(userId, null);
  }

  ////////////////////
  /// FORGOT PASSWORD
  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user[0]) throw new UnauthorizedException('not found');
    const { token, hashedToken } = await this.generateResetToken();

    // Calculate expiration (e.g., 1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Delete any existing reset tokens for this user
    await this.db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user[0].id));

    // Insert the new reset token into the database
    // Save new token in the reset table
    await this.db.insert(passwordResetTokens).values({
      userId: user[0].id,
      hashedToken: hashedToken,
      expiresAt: expiresAt,
    });

    // Send the email with reset link
    await this.emailService.sendPasswordResetEmail(user[0].email, token);

    // Return success message (don't return the token in production)
    return {
      message: 'Password reset instructions sent to your email',
      email: user[0].email,
    };
  }

  // Generate a secure random token
  async generateResetToken() {
    // Create a random token (32 bytes = 256 bits of entropy, encoded as hex)
    const token = crypto.randomBytes(32).toString('hex');

    // Hash the token using SHA-256 for storage
    const hashedToken = createHash('sha256').update(token).digest('hex');

    return { token, hashedToken };
  }

  async verifyResetToken(providedToken: string, storedHashedToken: string) {
    const hashedProvidedToken = createHash('sha256')
      .update(providedToken)
      .digest('hex');
    return hashedProvidedToken === storedHashedToken;
  }

  /// RESET PASSWORD

  async resetPassword(token: string, newPassword: string) {
    // Hash the provided token
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Look up the token in the database
    const resetTokenRecord = await this.db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.hashedToken, hashedToken))
      .limit(1);

    if (!resetTokenRecord[0]) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Check if token is expired
    if (new Date() > resetTokenRecord[0].expiresAt) {
      // Delete expired token
      await this.db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, resetTokenRecord[0].id));
      throw new UnauthorizedException('Token expired');
    }

    // Get user and update password
    const user = await this.userService.findOneById(resetTokenRecord[0].userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Hash the new password (using Argon2 or whatever you use for passwords)
    const hashedPassword = await hash(newPassword);

    // Update the user's password
    await this.userService.updatePassword(user.id, hashedPassword);

    // Delete the used token
    await this.db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, resetTokenRecord[0].id));

    return { message: 'Password updated successfully' };
  }
}
