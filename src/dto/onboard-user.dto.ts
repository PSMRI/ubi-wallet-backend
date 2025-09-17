import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardUserDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'External user ID (optional)',
    example: 'ext_user_123',
    required: false,
  })
  @IsString()
  @IsOptional()
  externalUserId: string;

  @ApiProperty({
    description: 'Unique username for login',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User phone number (10 digits only)',
    example: '9876543210',
    required: false,
    pattern: '^\\d{10}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, {
    message: 'Phone number must be exactly 10 digits (e.g., 9876543210)',
  })
  phone?: string;
}
