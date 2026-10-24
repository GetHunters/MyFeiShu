import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type { AdminLoginRequest, AdminLoginResponse } from '@shared/api.interface';

export async function adminLogin(account: string, password: string): Promise<AdminLoginResponse> {
  const { data } = await axiosForBackend.post<AdminLoginResponse>(
    '/api/admin/login',
    { account, password } satisfies AdminLoginRequest,
  );
  return data;
}
