import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditUserProfileDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  full_name!: string;

  @IsString()
  @IsOptional()
  profile_picture_url?: string;
}
