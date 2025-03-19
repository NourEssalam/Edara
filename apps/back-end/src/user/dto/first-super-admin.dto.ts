// first-super-admin.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FirstSuperAdminDto {
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

  // Profile picture is optional, so no validation
  profile_picture_url?: string;
}
