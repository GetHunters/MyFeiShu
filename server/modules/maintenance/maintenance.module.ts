import { Module } from '@nestjs/common';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceOpenApiController } from './maintenance.openapi.controller';
import { MaintenanceService } from './maintenance.service';

@Module({
  controllers: [MaintenanceController, MaintenanceOpenApiController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}
