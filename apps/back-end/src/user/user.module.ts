import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [DrizzleModule],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
