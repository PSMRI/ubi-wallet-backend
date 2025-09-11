import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HousekeepingService } from './housekeeping/housekeeping.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly housekeepingService: HousekeepingService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the application is running',
  })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  checkHealth(): string {
    return this.appService.checkHealth();
  }

  @Get('housekeeping/stats')
  @ApiOperation({
    summary: 'Get housekeeping statistics',
    description: 'Retrieve statistics about VC watchers and system health',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalWatchers: { type: 'number', example: 150 },
        activeWatchers: { type: 'number', example: 145 },
        inactiveWatchers: { type: 'number', example: 5 },
        totalVCs: { type: 'number', example: 300 },
        watchedVCs: { type: 'number', example: 280 },
        unwatchedVCs: { type: 'number', example: 20 },
      },
    },
  })
  async getHousekeepingStats() {
    return await this.housekeepingService.getWalletVCWatcherStats();
  }

  @Post('housekeeping/add-watchers')
  @ApiOperation({
    summary: 'Add watchers for missing VCs',
    description:
      "Automatically add watchers for VCs that don't have watchers configured",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chunkSize: {
          type: 'number',
          description: 'Number of VCs to process in each batch',
          example: 100,
          default: 100,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Watchers added successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Watchers added successfully' },
        data: {
          type: 'object',
          properties: {
            totalProcessed: { type: 'number', example: 50 },
            watchersAdded: { type: 'number', example: 45 },
            errors: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  async addWatchersForMissingVCs(@Body() body?: { chunkSize?: number }) {
    const chunkSize = body?.chunkSize || 100;
    return await this.housekeepingService.addWatchersForMissingWalletVCs(
      chunkSize,
    );
  }
}
