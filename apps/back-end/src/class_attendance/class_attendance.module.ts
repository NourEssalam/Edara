import { Module } from '@nestjs/common';
import { ClassAttendanceService } from './class_attendance.service';
import { ClassAttendanceController } from './class_attendance.controller';

@Module({
  providers: [ClassAttendanceService],
  controllers: [ClassAttendanceController],
})
export class ClassAttendanceModule {}
