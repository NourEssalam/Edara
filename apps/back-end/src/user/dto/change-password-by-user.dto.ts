import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  oldPassword!: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword!: string;
}
