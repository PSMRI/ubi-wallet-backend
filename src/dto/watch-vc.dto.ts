import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WatchVcDto {
  @ApiProperty({
    description: 'Public ID of the Verifiable Credential to watch',
    example: 'abc123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  vcPublicId: string;

  @ApiProperty({
    description: 'Email address for watcher notifications',
    example: 'watcher@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'VC identifier',
    example: 'vc_identifier_123',
    required: false,
  })
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiProperty({
    description: 'Callback URL for VC update notifications',
    example: 'https://your-app.com/callback',
    required: false,
    maxLength: 1500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  @IsUrl({}, { message: 'callbackUrl must be a valid URL' })
  callbackUrl?: string;

  @ApiProperty({
    description: 'Optional external URL to forward callback notifications to',
    example: 'https://external-service.com/webhook',
    required: false,
    maxLength: 1500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  @IsUrl({}, { message: 'forwardWatcherCallbackUrl must be a valid URL' })
  forwardWatcherCallbackUrl?: string;
}
