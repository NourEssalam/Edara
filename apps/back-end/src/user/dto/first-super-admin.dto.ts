import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Length,
} from 'class-validator';

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

  @IsString({ message: 'Matricule must be a string' })
  @Length(10, 10, { message: 'Matricule must be exactly 10 characters long' })
  @IsNotEmpty({ message: 'Matricule is required' })
  matricule!: string;

  @IsString({ message: 'CIN must be a string' })
  @Length(8, 8, { message: 'CIN must be exactly 8 characters long' })
  @IsNotEmpty({ message: 'CIN is required' })
  cin!: string;
}
