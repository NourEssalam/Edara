import { Controller } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';

@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  // @Get()
  // findAll() {
  //   return this.leaveRequestsService.findAll();
  // }
}
