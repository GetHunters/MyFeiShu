import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { PlatformModule } from '@lark-apaas/fullstack-nestjs-core';

import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { ViewModule } from './modules/view/view.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { SummariesModule } from './modules/summaries/summaries.module';
import { MesSummaryModule } from './modules/mes-summary/mes-summary.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // 平台 Module，提供平台能力
    PlatformModule.forRoot(),
    // ====== @route-section: business-modules START ======
    // Place all business modules here.Do NOT add fallback modules here.
    ReportsModule,
    MaintenanceModule,
    SummariesModule,
    MesSummaryModule,
    AdminModule,
    // ====== @route-section: business-modules END ======

    // ⚠️ @route-order: last
    // ViewModule is the fallback route module, must be registered last.
    ViewModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
