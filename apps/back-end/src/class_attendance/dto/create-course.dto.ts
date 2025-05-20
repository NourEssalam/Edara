import {
  IsNotEmpty,
  MaxLength,
  IsArray,
  ArrayMinSize,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'اسم الدرس مطلوب' })
  @MaxLength(255, { message: 'اسم الدرس يجب ألا يتجاوز 255 حرفًا' })
  course_name!: string;

  @IsArray({ message: 'teacher_ids يجب أن يكون مصفوفة' })
  @ArrayMinSize(1, { message: 'يجب اختيار أستاذ واحد على الأقل' })
  @IsString({ each: true, message: 'كل معرّف للأستاذ يجب أن يكون نصًا' })
  teacher_ids!: string[];
}
