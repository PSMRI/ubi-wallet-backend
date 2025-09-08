import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WatchCallbackDto {
  @ApiProperty({
    description: 'VC identifier',
    example: 'vc_identifier_123',
    required: false,
  })
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiProperty({
    description: 'Public ID of the record being updated',
    example: 'abc123',
    required: false,
  })
  @IsString()
  @IsOptional()
  recordPublicId?: string;

  @ApiProperty({
    description: 'Type of the callback event',
    example: 'vc_updated',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Callback message or description',
    example: 'VC has been updated successfully',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'User ID associated with the callback',
    example: 'user_123',
    required: false,
  })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'Status of the VC update',
    example: 'updated',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Timestamp of the callback',
    example: '2023-12-01T12:00:00Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  timestamp?: string;
}
