// create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from '@repo/shared-types'; // Adjust import path as needed

export class CreateUserDto {
  @IsString({ message: 'Matricule must be a string' })
  @IsNotEmpty({ message: 'Matricule is required' })
  @Length(1, 10, { message: 'Matricule cannot exceed 10 characters' })
  matricule!: string;

  @IsString({ message: 'CIN must be a string' })
  @IsNotEmpty({ message: 'CIN is required' })
  @Length(8, 8, { message: 'CIN must be exactly 8 characters' })
  @Matches(/^\d+$/, { message: 'CIN must contain only digits' })
  cin!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  full_name!: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsNotEmpty({ message: 'User role is required' })
  role!: UserRole;

  @IsString()
  @IsOptional()
  profile_picture_url?: string;
}
