import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaveRequestsService {
  getHello(): string {
    return 'Hello World!';
  }
}
