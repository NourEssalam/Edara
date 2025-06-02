import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Matches,
  MaxLength,
} from 'class-validator';
import { LeaveType } from '@repo/shared-types';

export class CreateLeaveRequestDto {
  @IsNumber({}, { message: 'معرف المستخدم يجب أن يكون رقمًا' })
  @IsNotEmpty({ message: 'معرف المستخدم مطلوب' })
  userId!: number;

  @IsEnum(LeaveType, { message: 'نوع العطلة غير صالح أو مفقود' })
  leaveType!: LeaveType;

  @IsString({ message: 'المعرّف الوحيد يجب أن يكون نصًا' })
  @Matches(/^\d{10}$/, { message: 'المعرّف الوحيد يجب أن يحتوي على 10 أرقام' })
  @IsNotEmpty({ message: 'المعرّف الوحيد مطلوب' })
  matricule!: string;

  @IsString({ message: 'الاسم مطلوب' })
  @IsNotEmpty({ message: 'الاسم لا يمكن أن يكون فارغًا' })
  name!: string;

  @IsString({ message: 'الرتبة مطلوبة' })
  @IsNotEmpty({ message: 'الرتبة لا يمكن أن تكون فارغة' })
  grade!: string;

  @IsString({ message: 'الخطة الوظيفية مطلوبة' })
  jobPlan!: string;

  @IsString()
  @IsNotEmpty({ message: 'نص المصلحة مطلوب' })
  benefitText!: string;

  @IsDateString({}, { message: 'تاريخ بداية الإجازة غير صالح' })
  durationFrom!: string;

  @IsDateString({}, { message: 'تاريخ نهاية الإجازة غير صالح' })
  durationTo!: string;

  @IsNumber({}, { message: 'سنة الإجازة يجب أن تكون رقمًا' })
  leaveYear!: number;

  @IsOptional()
  @IsString({ message: 'عنوان الإجازة يجب أن يكون نصًا' })
  leaveAddress!: string;

  @IsOptional()
  @IsString({ message: 'الرمز البريدي يجب أن لا يتجاوز 5 أرقام' })
  @MaxLength(5, { message: 'الرمز البريدي يجب أن لا يتجاوز 5 أرقام' })
  postalCode!: string;

  @IsOptional()
  @IsString({ message: 'رقم الهاتف يجب أن لا يتجاوز 8 أرقام' })
  @MaxLength(8, { message: 'رقم الهاتف يجب أن لا يتجاوز 8 أرقام' })
  phone!: string;

  @IsOptional()
  @IsString({ message: 'المرفقات يجب أن تكون نصًا' })
  attachedDocs?: string;
}
