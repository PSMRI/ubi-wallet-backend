import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The middle name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  middleName?: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: 'google',
    description: 'The SSO provider (e.g., google, facebook)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  sso_provider: string;

  @ApiProperty({
    example: '12345',
    description: 'The SSO ID provided by the provider',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  sso_id: string;

  @ApiProperty({
    example: '555-555-5555',
    description: 'The phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  phoneNumber?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'The date of birth of the user',
    required: false,
  })
  @IsOptional()
  @IsDate()
  dob?: Date;

  @ApiProperty({
    example: 'path/to/image.jpg',
    description: 'The profile image of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  image?: string;
}
