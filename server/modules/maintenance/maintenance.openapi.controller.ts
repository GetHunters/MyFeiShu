import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { UpsertMaintenanceDto } from './dto';

@Controller('openapi/maintenance')
export class MaintenanceOpenApiController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  async list() {
    return this.maintenanceService.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.maintenanceService.detail(id);
  }

  @Post()
  async push(@Body() dto: UpsertMaintenanceDto) {
    return this.maintenanceService.upsert(dto);
  }
}
