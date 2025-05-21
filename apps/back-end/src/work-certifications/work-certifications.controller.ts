import { Controller } from '@nestjs/common';
import { WorkCertificationsService } from './work-certifications.service';

@Controller('work-certifications')
export class WorkCertificationsController {
  constructor(private readonly workCertificationsService: WorkCertificationsService) {}
}
