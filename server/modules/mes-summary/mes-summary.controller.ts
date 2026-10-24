import { Controller, Get, Param } from '@nestjs/common';
import { MesSummaryService } from './mes-summary.service';

@Controller('api/mes-summary')
export class MesSummaryController {
  constructor(private readonly mesSummaryService: MesSummaryService) {}

  @Get()
  async list() {
    return this.mesSummaryService.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.mesSummaryService.detail(id);
  }
}
