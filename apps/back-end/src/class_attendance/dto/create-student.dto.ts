import { IsNotEmpty, Length, MaxLength } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'رقم التعريف الوطني مطلوب' })
  @Length(8, 8, { message: 'رقم التعريف الوطني يجب أن يكون مكونًا من 8 أرقام' })
  cin!: string;

  @IsNotEmpty({ message: 'الاسم الشخصي مطلوب' })
  @MaxLength(255, { message: 'الاسم الشخصي يجب ألا يتجاوز 255 حرفًا' })
  first_name!: string;

  @IsNotEmpty({ message: 'الاسم العائلي مطلوب' })
  @MaxLength(255, { message: 'الاسم العائلي يجب ألا يتجاوز 255 حرفًا' })
  last_name!: string;
}
