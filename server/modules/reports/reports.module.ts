import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsOpenApiController } from './reports.openapi.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController, ReportsOpenApiController],
  providers: [ReportsService],
})
export class ReportsModule {}
