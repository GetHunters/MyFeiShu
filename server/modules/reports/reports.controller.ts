import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { NeedLogin } from '@lark-apaas/fullstack-nestjs-core';
import type { Request } from 'express';
import { ReportsService } from './reports.service';
import { UpsertDailyReportDto } from './dto';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async list() {
    return this.reportsService.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.reportsService.detail(id);
  }

  @NeedLogin()
  @Post()
  async upsert(@Req() req: Request, @Body() dto: UpsertDailyReportDto) {
    const { userId } = req.userContext;
    return this.reportsService.upsert(dto, 'manual', userId);
  }

  @NeedLogin()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reportsService.remove(id);
    return { success: true };
  }
}
