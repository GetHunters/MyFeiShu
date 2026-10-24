import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import type { UpsertMaintenanceRequest } from '@shared/api.interface';

export class UpsertMaintenanceDto implements UpsertMaintenanceRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'recordDate 必须是 YYYY-MM-DD 格式' })
  recordDate!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5_000_000)
  htmlContent!: string;
}
