import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  WorkSummaryDetail,
  WorkSummaryListResponse,
} from '@shared/api.interface';

export async function fetchWorkSummaries(): Promise<WorkSummaryListResponse> {
  const response = await axiosForBackend({
    url: '/api/summaries',
    method: 'GET',
  });
  return response.data;
}

export async function fetchWorkSummaryDetail(
  id: string,
): Promise<WorkSummaryDetail> {
  const response = await axiosForBackend({
    url: `/api/summaries/${id}`,
    method: 'GET',
  });
  return response.data;
}
