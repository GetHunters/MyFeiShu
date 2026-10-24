/* 前后端共享的类型写在这里 */

export type DailyReportSource = 'manual' | 'openapi';

export interface DailyReportSummary {
  id: string;
  title: string;
  /** 业务日期，格式 YYYY-MM-DD（Asia/Shanghai 自然日） */
  reportDate: string;
  source: DailyReportSource;
  /** ISO 时间字符串 */
  updatedAt: string;
}

export interface DailyReportDetail extends DailyReportSummary {
  htmlContent: string;
}

export interface DailyReportListResponse {
  items: DailyReportSummary[];
}

export interface UpsertDailyReportRequest {
  title: string;
  /** 业务日期，格式 YYYY-MM-DD */
  reportDate: string;
  htmlContent: string;
}

export interface UpsertDailyReportResponse {
  id: string;
  reportDate: string;
  /** 是否覆盖了同日期的已有日报 */
  overwritten: boolean;
}

/* ===== 保养记录（豆包推送，访客可读） ===== */

export interface MaintenanceItem {
  id: string;
  title: string;
  /** 业务日期，格式 YYYY-MM-DD（Asia/Shanghai 自然日） */
  recordDate: string;
  source: DailyReportSource;
  /** ISO 时间字符串 */
  updatedAt: string;
}

export interface MaintenanceDetail extends MaintenanceItem {
  htmlContent: string;
}

export interface MaintenanceListResponse {
  items: MaintenanceItem[];
}

export interface UpsertMaintenanceRequest {
  title: string;
  /** 业务日期，格式 YYYY-MM-DD，同日期已存在时覆盖更新 */
  recordDate: string;
  htmlContent: string;
}

export interface UpsertMaintenanceResponse {
  id: string;
  recordDate: string;
  /** 是否覆盖了同日期的已有记录 */
  overwritten: boolean;
}

/* ===== MES 每日总结（openapi 推送，所有用户可见） ===== */

export interface MesSummaryItem {
  id: string;
  title: string;
  /** 业务日期，格式 YYYY-MM-DD（Asia/Shanghai 自然日） */
  recordDate: string;
  source: DailyReportSource;
  /** ISO 时间字符串 */
  updatedAt: string;
}

export interface MesSummaryDetail extends MesSummaryItem {
  htmlContent: string;
}

export interface MesSummaryListResponse {
  items: MesSummaryItem[];
}

export interface UpsertMesSummaryRequest {
  title: string;
  /** 业务日期，格式 YYYY-MM-DD，同日期已存在时覆盖更新 */
  recordDate: string;
  htmlContent: string;
}

export interface UpsertMesSummaryResponse {
  id: string;
  recordDate: string;
  /** 是否覆盖了同日期的已有总结 */
  overwritten: boolean;
}

/* ===== 每日工作总结（豆包推送，仅管理员可读） ===== */

export interface WorkSummaryItem {
  id: string;
  title: string;
  /** 业务日期，格式 YYYY-MM-DD（Asia/Shanghai 自然日） */
  summaryDate: string;
  source: DailyReportSource;
  /** ISO 时间字符串 */
  updatedAt: string;
}

export interface WorkSummaryDetail extends WorkSummaryItem {
  htmlContent: string;
}

export interface WorkSummaryListResponse {
  items: WorkSummaryItem[];
}

export interface UpsertWorkSummaryRequest {
  title: string;
  /** 业务日期，格式 YYYY-MM-DD，同日期已存在时覆盖更新 */
  summaryDate: string;
  htmlContent: string;
}

export interface UpsertWorkSummaryResponse {
  id: string;
  summaryDate: string;
  /** 是否覆盖了同日期的已有总结 */
  overwritten: boolean;
}

/* ===== 管理员登录 ===== */

export interface AdminLoginRequest {
  account: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
}

/* ===== 系统更新日志（仅管理员可见） ===== */

export interface SystemChangelogItem {
  id: string;
  title: string;
  content: string;
  /** ISO 时间字符串 */
  createdAt: string;
  /** ISO 时间字符串 */
  updatedAt: string;
}

export interface SystemChangelogListResponse {
  items: SystemChangelogItem[];
}

export interface CreateSystemChangelogRequest {
  title: string;
  content: string;
}

export interface UpdateSystemChangelogRequest {
  title?: string;
  content?: string;
}
