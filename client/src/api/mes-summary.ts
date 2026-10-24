import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  MesSummaryDetail,
  MesSummaryListResponse,
} from '@shared/api.interface';
import { demoData, markDemoMode } from './demo-data';

export async function fetchMesSummaries(): Promise<MesSummaryListResponse> {
  try {
    const response = await axiosForBackend({
      url: '/api/mes-summary',
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    return { items: demoData.mesSummaries };
  }
}

export async function fetchMesSummaryDetail(
  id: string,
): Promise<MesSummaryDetail> {
  try {
    const response = await axiosForBackend({
      url: `/api/mes-summary/${id}`,
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    const found = demoData.mesSummaries.find((m) => m.id === id);
    return {
      ...(found ?? demoData.mesSummaries[0]),
      htmlContent: demoData.mesDetailHtml,
    };
  }
}
