import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DRIZZLE_DATABASE,
  type PostgresJsDatabase,
} from '@lark-apaas/fullstack-nestjs-core';
import { desc, eq } from 'drizzle-orm';
import { dailyMaintenance } from '@server/database/schema';
import type {
  DailyReportSource,
  MaintenanceDetail,
  MaintenanceItem,
  MaintenanceListResponse,
  UpsertMaintenanceRequest,
  UpsertMaintenanceResponse,
} from '@shared/api.interface';

type MaintenanceRow = {
  id: string;
  title: string;
  recordDate: string;
  source: string;
  updatedAt: Date;
};

const summaryColumns = {
  id: dailyMaintenance.id,
  title: dailyMaintenance.title,
  recordDate: dailyMaintenance.recordDate,
  source: dailyMaintenance.source,
  updatedAt: dailyMaintenance.updatedAt,
};

function toItem(row: MaintenanceRow): MaintenanceItem {
  return {
    id: row.id,
    title: row.title,
    recordDate: row.recordDate,
    source: row.source as DailyReportSource,
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(
    @Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase,
  ) {}

  async list(): Promise<MaintenanceListResponse> {
    const rows: MaintenanceRow[] = await this.db
      .select(summaryColumns)
      .from(dailyMaintenance)
      .orderBy(desc(dailyMaintenance.recordDate));
    return { items: rows.map((row: MaintenanceRow) => toItem(row)) };
  }

  async detail(id: string): Promise<MaintenanceDetail> {
    const rows = await this.db
      .select({ ...summaryColumns, htmlContent: dailyMaintenance.htmlContent })
      .from(dailyMaintenance)
      .where(eq(dailyMaintenance.id, id));
    const row = rows[0] as
      | (MaintenanceRow & { htmlContent: string })
      | undefined;
    if (!row) {
      throw new NotFoundException(`保养记录 ${id} 不存在`);
    }
    return { ...toItem(row), htmlContent: row.htmlContent };
  }

  async upsert(
    dto: UpsertMaintenanceRequest,
  ): Promise<UpsertMaintenanceResponse> {
    const existing = await this.db
      .select({ id: dailyMaintenance.id })
      .from(dailyMaintenance)
      .where(eq(dailyMaintenance.recordDate, dto.recordDate));

    const insertValues: typeof dailyMaintenance.$inferInsert = {
      title: dto.title,
      recordDate: dto.recordDate,
      htmlContent: dto.htmlContent,
      source: 'openapi',
      updatedAt: new Date(),
    };

    const conflictSet: Partial<typeof dailyMaintenance.$inferInsert> = {
      title: dto.title,
      htmlContent: dto.htmlContent,
      source: 'openapi',
      updatedAt: new Date(),
    };

    const rows = await this.db
      .insert(dailyMaintenance)
      .values(insertValues)
      .onConflictDoUpdate({
        target: dailyMaintenance.recordDate,
        set: conflictSet,
      })
      .returning({
        id: dailyMaintenance.id,
        recordDate: dailyMaintenance.recordDate,
      });

    const row = rows[0];
    if (!row) {
      this.logger.error(`保养记录写入失败 recordDate=${dto.recordDate}`);
      throw new InternalServerErrorException('保养记录写入失败');
    }
    return {
      id: row.id,
      recordDate: row.recordDate,
      overwritten: existing.length > 0,
    };
  }
}
