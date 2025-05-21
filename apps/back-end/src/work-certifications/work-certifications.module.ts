import { Module } from '@nestjs/common';
import { WorkCertificationsService } from './work-certifications.service';
import { WorkCertificationsController } from './work-certifications.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [WorkCertificationsController],
  providers: [WorkCertificationsService],
})
export class WorkCertificationsModule {}
