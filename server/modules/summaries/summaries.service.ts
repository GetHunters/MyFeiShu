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
import { dailySummary } from '@server/database/schema';
import type {
  DailyReportSource,
  UpsertWorkSummaryRequest,
  UpsertWorkSummaryResponse,
  WorkSummaryDetail,
  WorkSummaryItem,
  WorkSummaryListResponse,
} from '@shared/api.interface';

type SummaryRow = {
  id: string;
  title: string;
  summaryDate: string;
  source: string;
  updatedAt: Date;
};

const summaryColumns = {
  id: dailySummary.id,
  title: dailySummary.title,
  summaryDate: dailySummary.summaryDate,
  source: dailySummary.source,
  updatedAt: dailySummary.updatedAt,
};

function toItem(row: SummaryRow): WorkSummaryItem {
  return {
    id: row.id,
    title: row.title,
    summaryDate: row.summaryDate,
    source: row.source as DailyReportSource,
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

@Injectable()
export class SummariesService {
  private readonly logger = new Logger(SummariesService.name);

  constructor(
    @Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase,
  ) {}

  async list(): Promise<WorkSummaryListResponse> {
    const rows: SummaryRow[] = await this.db
      .select(summaryColumns)
      .from(dailySummary)
      .orderBy(desc(dailySummary.summaryDate));
    return { items: rows.map((row: SummaryRow) => toItem(row)) };
  }

  async detail(id: string): Promise<WorkSummaryDetail> {
    const rows = await this.db
      .select({ ...summaryColumns, htmlContent: dailySummary.htmlContent })
      .from(dailySummary)
      .where(eq(dailySummary.id, id));
    const row = rows[0] as
      | (SummaryRow & { htmlContent: string })
      | undefined;
    if (!row) {
      throw new NotFoundException(`工作总结 ${id} 不存在`);
    }
    return { ...toItem(row), htmlContent: row.htmlContent };
  }

  async upsert(
    dto: UpsertWorkSummaryRequest,
  ): Promise<UpsertWorkSummaryResponse> {
    const existing = await this.db
      .select({ id: dailySummary.id })
      .from(dailySummary)
      .where(eq(dailySummary.summaryDate, dto.summaryDate));

    const insertValues: typeof dailySummary.$inferInsert = {
      title: dto.title,
      summaryDate: dto.summaryDate,
      htmlContent: dto.htmlContent,
      source: 'openapi',
      updatedAt: new Date(),
    };

    const conflictSet: Partial<typeof dailySummary.$inferInsert> = {
      title: dto.title,
      htmlContent: dto.htmlContent,
      source: 'openapi',
      updatedAt: new Date(),
    };

    const rows = await this.db
      .insert(dailySummary)
      .values(insertValues)
      .onConflictDoUpdate({
        target: dailySummary.summaryDate,
        set: conflictSet,
      })
      .returning({
        id: dailySummary.id,
        summaryDate: dailySummary.summaryDate,
      });

    const row = rows[0];
    if (!row) {
      this.logger.error(`工作总结写入失败 summaryDate=${dto.summaryDate}`);
      throw new InternalServerErrorException('工作总结写入失败');
    }
    return {
      id: row.id,
      summaryDate: row.summaryDate,
      overwritten: existing.length > 0,
    };
  }
}
