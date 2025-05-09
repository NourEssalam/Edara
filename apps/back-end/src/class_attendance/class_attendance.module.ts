import { Module } from '@nestjs/common';
import { ClassAttendanceService } from './class_attendance.service';
import { ClassAttendanceController } from './class_attendance.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [ClassAttendanceService],
  controllers: [ClassAttendanceController],
})
export class ClassAttendanceModule {}
