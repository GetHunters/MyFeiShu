import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  DailyReportDetail,
  DailyReportListResponse,
  UpsertDailyReportRequest,
  UpsertDailyReportResponse,
} from '@shared/api.interface';
import { demoData, markDemoMode } from './demo-data';

export async function fetchReports(): Promise<DailyReportListResponse> {
  try {
    const response = await axiosForBackend({
      url: '/api/reports',
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    return {
      items: demoData.reports.map(({ htmlContent: _h, ...rest }) => rest),
    };
  }
}

export async function fetchReportDetail(id: string): Promise<DailyReportDetail> {
  try {
    const response = await axiosForBackend({
      url: `/api/reports/${id}`,
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    return (
      demoData.reports.find((r) => r.id === id) ?? demoData.reports[0]
    );
  }
}

export async function upsertReport(
  request: UpsertDailyReportRequest,
): Promise<UpsertDailyReportResponse> {
  try {
    const response = await axiosForBackend({
      url: '/api/reports',
      method: 'POST',
      data: request,
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    return {
      id: `demo-${Date.now()}`,
      reportDate: request.reportDate,
      overwritten: false,
    };
  }
}

export async function deleteReport(id: string): Promise<void> {
  try {
    await axiosForBackend({
      url: `/api/reports/${id}`,
      method: 'DELETE',
    });
  } catch (err) {
    markDemoMode();
    return;
  }
}
