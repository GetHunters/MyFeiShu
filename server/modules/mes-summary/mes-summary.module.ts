import { Module } from '@nestjs/common';
import { MesSummaryController } from './mes-summary.controller';
import { MesSummaryOpenApiController } from './mes-summary.openapi.controller';
import { MesSummaryService } from './mes-summary.service';

@Module({
  controllers: [MesSummaryController, MesSummaryOpenApiController],
  providers: [MesSummaryService],
})
export class MesSummaryModule {}
