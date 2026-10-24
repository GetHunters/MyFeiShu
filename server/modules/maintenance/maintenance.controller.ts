import { Controller, Get, Param } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';

@Controller('api/maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  async list() {
    return this.maintenanceService.list();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.maintenanceService.detail(id);
  }
}
