// create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRole, UserStatus } from '@repo/shared-types'; // Adjust import path as needed

export class UpdateUserBySuperAdminDto {
  @IsEmail({}, { message: 'يرجى تقديم بريد إلكتروني صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email!: string;

  @IsString({ message: 'الاسم الكامل يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'الاسم الكامل مطلوب' })
  full_name!: string;

  @IsEnum(UserRole, { message: 'دور المستخدم غير صالح' })
  @IsNotEmpty({ message: 'دور المستخدم مطلوب' })
  role!: UserRole;

  @IsEnum(UserStatus, { message: 'حالة المستخدم غير صالحة' })
  @IsOptional()
  status?: UserStatus;

  @IsString({ message: 'رابط صورة الملف الشخصي يجب أن يكون نصاً' })
  @IsOptional()
  profile_picture_url?: string;

  @IsString({ message: 'المعرف المهني يجب أن يكون نصاً' })
  @Length(10, 10, { message: 'المعرف المهني يجب أن يكون مكونًا من 10 أرقام' })
  @IsNotEmpty({ message: 'المعرف المهني مطلوب' })
  matricule!: string;

  @IsString({ message: 'رقم بطاقة التعريف الوطنية يجب أن يكون نصاً' })
  @Length(8, 8, {
    message: 'رقم بطاقة التعريف الوطنية يجب أن يكون مكونًا من 8 أرقام',
  })
  @Matches(/^\d+$/, {
    message: 'رقم بطاقة التعريف الوطنية يجب أن يحتوي على أرقام فقط',
  })
  @IsNotEmpty({ message: 'رقم بطاقة التعريف الوطنية مطلوب' })
  cin!: string;
}
