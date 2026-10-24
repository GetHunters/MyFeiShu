import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  MaintenanceDetail,
  MaintenanceListResponse,
} from '@shared/api.interface';

export async function fetchMaintenanceRecords(): Promise<MaintenanceListResponse> {
  const response = await axiosForBackend({
    url: '/api/maintenance',
    method: 'GET',
  });
  return response.data;
}

export async function fetchMaintenanceDetail(
  id: string,
): Promise<MaintenanceDetail> {
  const response = await axiosForBackend({
    url: `/api/maintenance/${id}`,
    method: 'GET',
  });
  return response.data;
}
