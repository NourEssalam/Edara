import { CreateLeaveRequestDto } from './create-leave-request.dto';
import { IsString } from 'class-validator';

export class UpdateLeaveRequestDto extends CreateLeaveRequestDto {
  @IsString()
  requestId!: string;
}
