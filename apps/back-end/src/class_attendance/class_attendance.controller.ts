import { ClassAttendanceService } from './class_attendance.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@repo/shared-types';

@Controller('class-attendance')
export class ClassAttendanceController {
  constructor(
    private readonly classAttendanceService: ClassAttendanceService,
  ) {}

  //TODO: Add roles
  // @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Public()
  @Post('create-class')
  @UseInterceptors(FileInterceptor('file'))
  async createClassWithStudents(
    @UploadedFile() file: Express.Multer.File,
    @Body('class_name') className: string,
  ) {
    return this.classAttendanceService.processClassCreation(file, className);
  }
}
