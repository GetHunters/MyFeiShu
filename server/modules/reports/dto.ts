import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import type { UpsertDailyReportRequest } from '@shared/api.interface';

export class UpsertDailyReportDto implements UpsertDailyReportRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'reportDate 必须是 YYYY-MM-DD 格式' })
  reportDate!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5_000_000)
  htmlContent!: string;
}
