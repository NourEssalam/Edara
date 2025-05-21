import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { ClassAttendanceModule } from './class_attendance/class_attendance.module';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module';
import { WorkCertificationsModule } from './work-certifications/work-certifications.module';

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    EmailModule,
    ClassAttendanceModule,
    LeaveRequestsModule,
    WorkCertificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
