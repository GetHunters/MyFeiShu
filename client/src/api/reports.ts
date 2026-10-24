import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  DailyReportDetail,
  DailyReportListResponse,
  UpsertDailyReportRequest,
  UpsertDailyReportResponse,
} from '@shared/api.interface';

export async function fetchReports(): Promise<DailyReportListResponse> {
  const response = await axiosForBackend({
    url: '/api/reports',
    method: 'GET',
  });
  return response.data;
}

export async function fetchReportDetail(id: string): Promise<DailyReportDetail> {
  const response = await axiosForBackend({
    url: `/api/reports/${id}`,
    method: 'GET',
  });
  return response.data;
}

export async function upsertReport(
  request: UpsertDailyReportRequest,
): Promise<UpsertDailyReportResponse> {
  const response = await axiosForBackend({
    url: '/api/reports',
    method: 'POST',
    data: request,
  });
  return response.data;
}

export async function deleteReport(id: string): Promise<void> {
  await axiosForBackend({
    url: `/api/reports/${id}`,
    method: 'DELETE',
  });
}
