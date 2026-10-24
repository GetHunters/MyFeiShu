import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { UpsertDailyReportDto } from './dto';

@Controller('openapi/reports')
export class ReportsOpenApiController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async list() {
    return this.reportsService.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.reportsService.detail(id);
  }

  @Post()
  async push(@Body() dto: UpsertDailyReportDto) {
    return this.reportsService.upsert(dto, 'openapi');
  }
}
