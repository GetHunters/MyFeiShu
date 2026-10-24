import { Module } from '@nestjs/common';
import { SummariesController } from './summaries.controller';
import { SummariesOpenApiController } from './summaries.openapi.controller';
import { SummariesService } from './summaries.service';

@Module({
  controllers: [SummariesController, SummariesOpenApiController],
  providers: [SummariesService],
})
export class SummariesModule {}
