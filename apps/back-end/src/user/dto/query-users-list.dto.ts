// DTO for query parameters
import { IsOptional, IsInt, IsString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@repo/shared-types';

export class GetUsersQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: Object.values(UserRole) })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  roleFilter?: UserRole;

  @ApiProperty({ required: false, enum: Object.values(UserStatus) })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Invalid user status' })
  statusFilter?: UserStatus;

  @ApiProperty({ required: false, default: 'created_at' })
  @IsOptional()
  @IsString()
  sortByColumn?: string = 'created_at';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
