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
import { dailyMesSummary } from '@server/database/schema';
import type {
  DailyReportSource,
  MesSummaryDetail,
  MesSummaryItem,
  MesSummaryListResponse,
  UpsertMesSummaryRequest,
  UpsertMesSummaryResponse,
} from '@shared/api.interface';

type MesSummaryRow = {
  id: string;
  title: string;
  recordDate: string;
  source: string;
  updatedAt: Date;
};

const summaryColumns = {
  id: dailyMesSummary.id,
  title: dailyMesSummary.title,
  recordDate: dailyMesSummary.recordDate,
  source: dailyMesSummary.source,
  updatedAt: dailyMesSummary.updatedAt,
};

function toItem(row: MesSummaryRow): MesSummaryItem {
  return {
    id: row.id,
    title: row.title,
    recordDate: row.recordDate,
    source: row.source as DailyReportSource,
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

@Injectable()
export class MesSummaryService {
  private readonly logger = new Logger(MesSummaryService.name);

  constructor(
    @Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase,
  ) {}

  async list(): Promise<MesSummaryListResponse> {
    const rows: MesSummaryRow[] = await this.db
      .select(summaryColumns)
      .from(dailyMesSummary)
      .orderBy(desc(dailyMesSummary.recordDate));
    return { items: rows.map((row: MesSummaryRow) => toItem(row)) };
  }

  async detail(id: string): Promise<MesSummaryDetail> {
    const rows = await this.db
      .select({ ...summaryColumns, htmlContent: dailyMesSummary.htmlContent })
      .from(dailyMesSummary)
      .where(eq(dailyMesSummary.id, id));
    const row = rows[0] as
      | (MesSummaryRow & { htmlContent: string })
      | undefined;
    if (!row) {
      throw new NotFoundException(`MES 每日总结 ${id} 不存在`);
    }
    return { ...toItem(row), htmlContent: row.htmlContent };
  }

  async upsert(
    dto: UpsertMesSummaryRequest,
  ): Promise<UpsertMesSummaryResponse> {
    const existing = await this.db
      .select({ id: dailyMesSummary.id })
      .from(dailyMesSummary)
      .where(eq(dailyMesSummary.recordDate, dto.recordDate));

    const insertValues: typeof dailyMesSummary.$inferInsert = {
      title: dto.title,
      recordDate: dto.recordDate,
      htmlContent: dto.htmlContent,
      source: 'openapi',
      updatedAt: new Date(),
    };

    const conflictSet: Partial<typeof dailyMesSummary.$inferInsert> = {
      title: dto.title,
      htmlContent: dto.htmlContent,
      source: 'openapi',
      updatedAt: new Date(),
    };

    const rows = await this.db
      .insert(dailyMesSummary)
      .values(insertValues)
      .onConflictDoUpdate({
        target: dailyMesSummary.recordDate,
        set: conflictSet,
      })
      .returning({
        id: dailyMesSummary.id,
        recordDate: dailyMesSummary.recordDate,
      });

    const row = rows[0];
    if (!row) {
      this.logger.error(`MES 每日总结写入失败 recordDate=${dto.recordDate}`);
      throw new InternalServerErrorException('MES 每日总结写入失败');
    }
    return {
      id: row.id,
      recordDate: row.recordDate,
      overwritten: existing.length > 0,
    };
  }
}
