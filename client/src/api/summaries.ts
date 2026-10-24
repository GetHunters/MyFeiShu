import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  WorkSummaryDetail,
  WorkSummaryListResponse,
} from '@shared/api.interface';
import { demoData, markDemoMode } from './demo-data';

export async function fetchWorkSummaries(): Promise<WorkSummaryListResponse> {
  try {
    const response = await axiosForBackend({
      url: '/api/summaries',
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    return { items: demoData.summaries };
  }
}

export async function fetchWorkSummaryDetail(
  id: string,
): Promise<WorkSummaryDetail> {
  try {
    const response = await axiosForBackend({
      url: `/api/summaries/${id}`,
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    const found = demoData.summaries.find((s) => s.id === id);
    return {
      ...(found ?? demoData.summaries[0]),
      htmlContent: demoData.summaryDetailHtml,
    };
  }
}
