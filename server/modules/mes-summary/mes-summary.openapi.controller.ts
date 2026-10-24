import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MesSummaryService } from './mes-summary.service';
import { UpsertMesSummaryDto } from './dto';

@Controller('openapi/mes-summary')
export class MesSummaryOpenApiController {
  constructor(private readonly mesSummaryService: MesSummaryService) {}

  @Get()
  async list() {
    return this.mesSummaryService.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.mesSummaryService.detail(id);
  }

  @Post()
  async push(@Body() dto: UpsertMesSummaryDto) {
    return this.mesSummaryService.upsert(dto);
  }
}
