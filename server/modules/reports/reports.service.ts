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
import { dailyReport } from '@server/database/schema';
import type {
  DailyReportDetail,
  DailyReportListResponse,
  DailyReportSource,
  DailyReportSummary,
  UpsertDailyReportRequest,
  UpsertDailyReportResponse,
} from '@shared/api.interface';

type ReportRow = {
  id: string;
  title: string;
  reportDate: string;
  source: string;
  updatedAt: Date;
};

const summaryColumns = {
  id: dailyReport.id,
  title: dailyReport.title,
  reportDate: dailyReport.reportDate,
  source: dailyReport.source,
  updatedAt: dailyReport.updatedAt,
};

function toSummary(row: ReportRow): DailyReportSummary {
  return {
    id: row.id,
    title: row.title,
    reportDate: row.reportDate,
    source: row.source as DailyReportSource,
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase,
  ) {}

  async list(): Promise<DailyReportListResponse> {
    const rows: ReportRow[] = await this.db
      .select(summaryColumns)
      .from(dailyReport)
      .orderBy(desc(dailyReport.reportDate));
    return { items: rows.map((row: ReportRow) => toSummary(row)) };
  }

  async detail(id: string): Promise<DailyReportDetail> {
    const rows = await this.db
      .select({ ...summaryColumns, htmlContent: dailyReport.htmlContent })
      .from(dailyReport)
      .where(eq(dailyReport.id, id));
    const row = rows[0] as
      | (ReportRow & { htmlContent: string })
      | undefined;
    if (!row) {
      throw new NotFoundException(`日报 ${id} 不存在`);
    }
    return { ...toSummary(row), htmlContent: row.htmlContent };
  }

  async upsert(
    dto: UpsertDailyReportRequest,
    source: DailyReportSource,
    operatorUserId?: string,
  ): Promise<UpsertDailyReportResponse> {
    const existing = await this.db
      .select({ id: dailyReport.id })
      .from(dailyReport)
      .where(eq(dailyReport.reportDate, dto.reportDate));

    const insertValues: typeof dailyReport.$inferInsert = {
      title: dto.title,
      reportDate: dto.reportDate,
      htmlContent: dto.htmlContent,
      source,
      updatedAt: new Date(),
    };
    if (operatorUserId) {
      insertValues.createdBy = operatorUserId;
      insertValues.updatedBy = operatorUserId;
    }

    const conflictSet: Partial<typeof dailyReport.$inferInsert> = {
      title: dto.title,
      htmlContent: dto.htmlContent,
      source,
      updatedAt: new Date(),
    };
    if (operatorUserId) {
      conflictSet.updatedBy = operatorUserId;
    }

    const rows = await this.db
      .insert(dailyReport)
      .values(insertValues)
      .onConflictDoUpdate({
        target: dailyReport.reportDate,
        set: conflictSet,
      })
      .returning({ id: dailyReport.id, reportDate: dailyReport.reportDate });

    const row = rows[0];
    if (!row) {
      this.logger.error(`日报写入失败 reportDate=${dto.reportDate}`);
      throw new InternalServerErrorException('日报写入失败');
    }
    return {
      id: row.id,
      reportDate: row.reportDate,
      overwritten: existing.length > 0,
    };
  }

  async remove(id: string): Promise<void> {
    const rows = await this.db
      .delete(dailyReport)
      .where(eq(dailyReport.id, id))
      .returning({ id: dailyReport.id });
    if (rows.length === 0) {
      throw new NotFoundException(`日报 ${id} 不存在`);
    }
  }
}
