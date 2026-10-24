import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type {
  MaintenanceDetail,
  MaintenanceListResponse,
} from '@shared/api.interface';
import { demoData, markDemoMode } from './demo-data';

export async function fetchMaintenanceRecords(): Promise<MaintenanceListResponse> {
  try {
    const response = await axiosForBackend({
      url: '/api/maintenance',
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    return { items: demoData.maintenance };
  }
}

export async function fetchMaintenanceDetail(
  id: string,
): Promise<MaintenanceDetail> {
  try {
    const response = await axiosForBackend({
      url: `/api/maintenance/${id}`,
      method: 'GET',
    });
    return response.data;
  } catch (err) {
    markDemoMode();
    const found = demoData.maintenance.find((m) => m.id === id);
    return {
      ...(found ?? demoData.maintenance[0]),
      htmlContent: demoData.maintenanceDetailHtml,
    };
  }
}
