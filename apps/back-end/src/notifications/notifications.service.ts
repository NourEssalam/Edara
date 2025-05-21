import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async notifyUser(userId: string, message: string) {
    // Send email, in-app notification, log, etc.
    console.log(`Notify user ${userId}: ${message}`);
  }
}
