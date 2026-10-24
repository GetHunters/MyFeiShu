import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import type { UpsertWorkSummaryRequest } from '@shared/api.interface';

export class UpsertWorkSummaryDto implements UpsertWorkSummaryRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'summaryDate 必须是 YYYY-MM-DD 格式' })
  summaryDate!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5_000_000)
  htmlContent!: string;
}
