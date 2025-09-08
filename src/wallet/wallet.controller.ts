import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { WatcherCronService } from './watcher-cron.service';
import { OnboardUserDto } from '../dto/onboard-user.dto';
import { UploadVcDto } from '../dto/upload-vc.dto';
import { WatchVcDto } from '../dto/watch-vc.dto';
import { WatchCallbackDto } from '../dto/watch-callback.dto';
import {
  LoginRequestDto,
  LoginVerifyDto,
  ResendOtpDto,
} from '../dto/login.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentToken } from '../common/decorators/user.decorator';

@ApiTags('Wallet')
@Controller('api/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly watcherCronService: WatcherCronService,
  ) {}

  @Post('onboard')
  @ApiOperation({
    summary: 'Onboard a new user',
    description:
      'Creates a new user account in both the local database and Dhiway wallet service',
  })
  @ApiBody({ type: OnboardUserDto })
  @ApiResponse({
    status: 200,
    description: 'User onboarded successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'User onboarded successfully' },
        data: {
          type: 'object',
          properties: {
            accountId: { type: 'string', example: 'ext_user_123' },
            token: { type: 'string', example: 'dhiway_token_here' },
            did: { type: 'string', example: 'did:example:123456789' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-123' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                username: { type: 'string', example: 'johndoe' },
                accountId: { type: 'string', example: 'ext_user_123' },
                status: { type: 'string', example: 'ACTIVE' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async onboardUser(@Body() data: OnboardUserDto) {
    return await this.walletService.onboardUser(data);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with username and password',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() data: LoginRequestDto) {
    return await this.walletService.login(data);
  }

  @Post('login/verify')
  @ApiOperation({
    summary: 'Verify login with OTP',
    description: 'Verify user login using OTP sent to registered phone number',
  })
  @ApiBody({ type: LoginVerifyDto })
  @ApiResponse({ status: 200, description: 'Login verification successful' })
  @ApiResponse({ status: 401, description: 'Invalid OTP' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async verifyLogin(@Body() data: LoginVerifyDto) {
    return await this.walletService.verifyLogin(data);
  }

  @Post('login/resend-otp')
  @ApiOperation({
    summary: 'Resend OTP',
    description: "Resend OTP to user's registered phone number",
  })
  @ApiBody({ type: ResendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async resendOtp(@Body() data: ResendOtpDto) {
    return await this.walletService.resendOtp(data);
  }

  @Get(':user_id/vcs')
  @ApiOperation({
    summary: 'Get all VCs for a user',
    description: 'Retrieve all Verifiable Credentials for a specific user',
  })
  @ApiParam({
    name: 'user_id',
    description: 'User ID',
    example: 'ext_user_123',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'VCs retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard)
  async getAllVCs(
    @Param('user_id') user_id: string,
    @CurrentToken() token: string,
  ) {
    return await this.walletService.getAllVCs(user_id, token);
  }

  @Get(':user_id/vcs/:vcId')
  @ApiOperation({
    summary: 'Get VC by ID',
    description: 'Retrieve a specific Verifiable Credential by its ID',
  })
  @ApiParam({
    name: 'user_id',
    description: 'User ID',
    example: 'ext_user_123',
  })
  @ApiParam({ name: 'vcId', description: 'VC ID', example: 'vc_123' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'VC retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'VC not found' })
  @UseGuards(AuthGuard)
  async getVCById(
    @Param('user_id') user_id: string,
    @Param('vcId') vcId: string,
    @CurrentToken() token: string,
  ) {
    return await this.walletService.getVCById(user_id, vcId, token);
  }

  @Post(':user_id/vcs/upload-qr')
  @ApiOperation({
    summary: 'Upload VC from QR code',
    description: 'Upload a Verifiable Credential by scanning a QR code',
  })
  @ApiParam({
    name: 'user_id',
    description: 'User ID',
    example: 'ext_user_123',
  })
  @ApiBody({ type: UploadVcDto })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'VC uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid QR data' })
  @UseGuards(AuthGuard)
  async uploadVCFromQR(
    @Param('user_id') user_id: string,
    @Body() data: UploadVcDto,
    @CurrentToken() token: string,
  ) {
    return await this.walletService.uploadVCFromQR(user_id, data, token);
  }

  @Post('vcs/watch')
  @ApiOperation({
    summary: 'Watch VC for updates',
    description:
      'Register a VC for monitoring updates and set up callback notifications',
  })
  @ApiBody({ type: WatchVcDto })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'VC watch registered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async watchVC(@Body() data: WatchVcDto, @CurrentToken() token: string) {
    return await this.walletService.watchVC(data, token);
  }

  @Get(':user_id/vc_json/:vcIdentifier')
  @ApiOperation({
    summary: 'Get VC JSON by identifier',
    description: 'Retrieve VC JSON data using VC identifier',
  })
  @ApiParam({
    name: 'user_id',
    description: 'User ID',
    example: 'ext_user_123',
  })
  @ApiParam({
    name: 'vcIdentifier',
    description: 'VC Identifier',
    example: 'vc_identifier_123',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'VC JSON retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'VC not found' })
  @UseGuards(AuthGuard)
  async getVCJsonByVcIdentifier(
    @Param('user_id') user_id: string,
    @Param('vcIdentifier') vcIdentifier: string,
    @CurrentToken() token: string,
  ) {
    return await this.walletService.getVCJsonByVcIdentifier(
      user_id,
      vcIdentifier,
      token,
    );
  }

  @Post('vcs/watch/callback')
  @ApiOperation({
    summary: 'VC Watch Callback (Webhook)',
    description:
      'Webhook endpoint for receiving VC update notifications from Dhiway',
  })
  @ApiBody({ type: WatchCallbackDto })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async watchCallback(@Body() data: WatchCallbackDto) {
    // Wait for 7 seconds to allow Dhiway update to complete
    await new Promise((resolve) => setTimeout(resolve, 7000));
    return this.walletService.processWatchCallback(data);
  }
}
