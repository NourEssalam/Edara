import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UserRole } from '@repo/shared-types';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
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

  // pending leave requests
  @Roles(UserRole.LEAVE_ADMIN)
  @Get('pending-leave-requests')
  getPendingLeaveRequests() {
    return this.leaveRequestsService.getAllPendingLeaveRequests();
  }

  // get leave request details
  @Roles(UserRole.LEAVE_ADMIN)
  @Get('get-request-details/:userId/:requestId')
  getLeaveRequestDetails(
    @Param('userId') userId: string,
    @Param('requestId') requestId: string,
  ) {
    const user_id = parseInt(userId, 10);
    return this.leaveRequestsService.getLeaveRequestDetails(requestId, user_id);
  }

  // leave refuse request
  @Post('refuse-leave-request')
  async rejectRequest(
    @Body()
    body: {
      requestId: string;
      userId: string;
      adminId: string;
      reason: string;
    },
  ) {
    console.log('body', body);
    const refuseLeaveRequestDto = {
      requestId: body.requestId,
      userId: parseInt(body.userId, 10),
      adminId: parseInt(body.adminId, 10),
      reason: body.reason,
    };
    console.log('refuseLeaveRequestDto', refuseLeaveRequestDto);
    return this.leaveRequestsService.refuseLeaveRequest(refuseLeaveRequestDto);
  }
}
