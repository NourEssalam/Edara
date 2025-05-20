import { IsEnum, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@repo/shared-types';

class StudentAttendanceDto {
  @IsInt()
  studentId!: number;

  @IsEnum(AttendanceStatus)
  attendanceStatus!: AttendanceStatus;
}

export class SaveAttendanceDto {
  @IsInt()
  courseSessionId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  attendanceData!: StudentAttendanceDto[];
}
