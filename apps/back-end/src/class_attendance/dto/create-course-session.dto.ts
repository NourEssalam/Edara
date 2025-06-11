import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseSessionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  topic!: string;

  @IsString()
  @IsNotEmpty()
  class_id!: string;

  @IsString()
  @IsNotEmpty()
  course_id!: string;
}
