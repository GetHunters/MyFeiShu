import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  MesSummaryDetail,
  MesSummaryListResponse,
} from '@shared/api.interface';

export async function fetchMesSummaries(): Promise<MesSummaryListResponse> {
  const response = await axiosForBackend({
    url: '/api/mes-summary',
    method: 'GET',
  });
  return response.data;
}

export async function fetchMesSummaryDetail(
  id: string,
): Promise<MesSummaryDetail> {
  const response = await axiosForBackend({
    url: `/api/mes-summary/${id}`,
    method: 'GET',
  });
  return response.data;
}
