import { Body, Controller, Post } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { UpsertWorkSummaryDto } from './dto';

@Controller('openapi/summaries')
export class SummariesOpenApiController {
  constructor(private readonly summariesService: SummariesService) {}

  @Post()
  async push(@Body() dto: UpsertWorkSummaryDto) {
    return this.summariesService.upsert(dto);
  }
}
