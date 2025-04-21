// create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole, UserStatus } from '@repo/shared-types'; // Adjust import path as needed

export class UpdateUserBySuperAdminDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  full_name!: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsNotEmpty({ message: 'User role is required' })
  role!: UserRole;

  @IsEnum(UserStatus, { message: 'Invalid user status' })
  @IsOptional()
  status?: UserStatus;

  @IsString()
  @IsOptional()
  profile_picture_url?: string;
}
