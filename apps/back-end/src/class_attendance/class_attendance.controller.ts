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
import { parse } from 'path';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('class-attendance')
export class ClassAttendanceController {
  constructor(
    private readonly classAttendanceService: ClassAttendanceService,
  ) {}

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Post('create-class')
  @UseInterceptors(FileInterceptor('file'))
  async createClassWithStudents(
    @UploadedFile() file: Express.Multer.File,
    @Body('class_name') className: string,
  ) {
    return this.classAttendanceService.processClassCreation(file, className);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('classes')
  async getAllClasses() {
    return this.classAttendanceService.getClasses();
  }

  // update class
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Patch('classes/:classId')
  async updateClass(
    @Param('classId') classId: string,
    @Body('class_name') className: string,
  ) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.updateClass(class_id, className);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Delete('classes/:classId')
  async deleteClass(@Param('classId') classId: string) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.deleteClass(class_id);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('class/:classId')
  async getClass(@Param('classId') classId: string) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.getClass(class_id);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN, UserRole.TEACHER)
  @Get('class/:classId/students')
  async getStudents(@Param('classId') classId: string) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.getClassStudents(class_id);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Post('class/:classId/students')
  async addStudentsToClass(
    @Param('classId') classId: string,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    const class_id = parseInt(classId, 10);
    console.log('createStudentDto', createStudentDto);
    return this.classAttendanceService.addStudentsToClass(
      class_id,
      createStudentDto,
    );
  }

  // UPDATE STUDENT
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Patch('class/:studentId/students/')
  async updateStudent(
    @Param('studentId') studentId: string,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    const student_id = parseInt(studentId, 10);
    return this.classAttendanceService.updateStudent(
      student_id,
      createStudentDto,
    );
  }

  // DELETE STUDENT
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Delete('class/:studentId/students/')
  async deleteStudent(@Param('studentId') studentId: string) {
    const student_id = parseInt(studentId, 10);
    return this.classAttendanceService.deleteStudent(student_id);
  }
}
