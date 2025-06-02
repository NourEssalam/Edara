import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
// import { UserRole } from '@repo/shared-types';
import { Public } from 'src/auth/decorators/public.decorator';
import { request } from 'axios';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';

@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  // create a leave request
  @Post('create')
  create(@Body() createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.leaveRequestsService.create(createLeaveRequestDto);
  }

  // get all leave requests of a user

  @Get('get-all-leave-requests/:id')
  getAllLeaveRequests(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return this.leaveRequestsService.getAllLeaveRequests(userId);
  }

  // get leave details
  // @Get('get-leave-details/:id')
  // getLeaveDetails(@Param('id') id: string) {
  //   const leaveRequestId = parseInt(id, 10);
  //   return this.leaveRequestsService.getLeaveDetails(leaveRequestId);
  // }

  // cancel a leave request
  @Patch('cancel-leave-request/:userId/:requestId')
  cancelLeaveRequest(
    @Param('userId') userId: string,
    @Param('requestId') requestId: string,
  ) {
    const user_id = parseInt(userId, 10);
    return this.leaveRequestsService.cancelLeaveRequest(requestId, user_id);
  }

  // update leave request
  @Patch('update-leave-request')
  updateLeaveRequest(@Body() updateLeaveRequestDto: UpdateLeaveRequestDto) {
    return this.leaveRequestsService.updateLeaveRequest(updateLeaveRequestDto);
  }
}
