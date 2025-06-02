import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { Database } from 'src/drizzle/types/drizzle';
import { leaveRequests } from 'src/drizzle/schema/leave-request.schema';
import { users } from 'src/drizzle/schema/users.schema';
import { eq, and } from 'drizzle-orm';
import { RequestStatus } from '@repo/shared-types';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
@Injectable()
export class LeaveRequestsService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  // create leave request
  async create(createLeaveRequestDto: CreateLeaveRequestDto) {
    // find matricule of the user
    const matricule = createLeaveRequestDto.matricule;
    const user = await this.db
      .select({ matricule: users.matricule })
      .from(users)
      .where(
        and(
          eq(users.matricule, matricule),
          eq(users.id, createLeaveRequestDto.userId),
        ),
      );
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    if (!user[0]?.matricule) {
      throw new NotFoundException('المُعَرِّف الوحيد خاطئ أو غير موجود');
    }

    // already have a pending leave request
    const leaveRequest = await this.db
      .select()
      .from(leaveRequests)
      .where(
        and(
          eq(leaveRequests.matricule, createLeaveRequestDto.matricule),
          eq(leaveRequests.requestStatus, 'PENDING'),
        ),
      );
    if (leaveRequest.length > 0) {
      throw new NotFoundException('لديك بالفعل طلب عطلة معلق');
    }

    return await this.db.insert(leaveRequests).values(createLeaveRequestDto);
  }

  // get all leave requests
  async getAllLeaveRequests(userId: number) {
    const leaveRequestsData = await this.db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.userId, userId));

    const today = new Date();

    const normalize = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const todayDate = normalize(today);

    const formattedResults = leaveRequestsData.map((req) => {
      const from = normalize(new Date(req.durationFrom));
      const to = normalize(new Date(req.durationTo));

      const totalPeriod =
        Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (req.requestStatus !== 'APPROVED') {
        return {
          ...req,
          totalPeriod,
          periodPassed: null,
          periodLeft: null,
        };
      }

      let periodPassed = 0;
      let periodLeft = 0;

      if (todayDate >= from && todayDate <= to) {
        // During leave
        periodPassed =
          Math.floor(
            (todayDate.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1;
        periodLeft = totalPeriod - periodPassed;
      } else if (todayDate < from) {
        // Future leave
        periodPassed = 0;
        periodLeft = totalPeriod;
      } else {
        // Past leave
        periodPassed = totalPeriod;
        periodLeft = 0;
      }

      return {
        ...req,
        totalPeriod,
        periodPassed,
        periodLeft,
      };
    });

    return formattedResults;
  }

  // cancel leave request

  async cancelLeaveRequest(leaveRequestId: string, userId: number) {
    try {
      console.log('leaveRequestId', leaveRequestId);
      console.log('userId', userId);
      const result = await this.db
        .update(leaveRequests)
        .set({ requestStatus: RequestStatus.CANCELED })
        .where(
          and(
            eq(leaveRequests.userId, userId),
            eq(leaveRequests.id, leaveRequestId),
          ),
        );

      // result could be number of rows affected or the updated record depending on ORM
      // Let's assume it's the number of affected rows
      if (!result) {
        throw new NotFoundException('طلب الإجازة غير موجود');
      }

      return result;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      // You can add more sophisticated error logging here if needed
      console.log(error);
      throw new InternalServerErrorException('حدث خطأ أثناء إلغاء طلب الإجازة');
    }
  }
  // update leave request

  async updateLeaveRequest(body: UpdateLeaveRequestDto) {
    const { userId, requestId, ...rest } = body;
    console.log('userId', userId);
    console.log('requestId', requestId);
    try {
      const result = await this.db
        .update(leaveRequests)
        .set({ ...rest })
        .where(
          and(
            eq(leaveRequests.userId, body.userId),
            eq(leaveRequests.id, body.requestId),
          ),
        );

      // result could be number of rows affected or the updated record depending on ORM
      // Let's assume it's the number of affected rows
      if (!result) {
        throw new NotFoundException('طلب الإجازة غير موجود');
      }

      return result;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      // You can add more sophisticated error logging here if needed
      console.log(error);
      throw new InternalServerErrorException('حدث خطاء في تحديث طلب الإجازة');
    }
  }
}
