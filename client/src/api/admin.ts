import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import type { AdminLoginRequest, AdminLoginResponse } from '@shared/api.interface';
import { markDemoMode } from './demo-data';

export async function adminLogin(account: string, password: string): Promise<AdminLoginResponse> {
  try {
    const { data } = await axiosForBackend.post<AdminLoginResponse>(
      '/api/admin/login',
      { account, password } satisfies AdminLoginRequest,
    );
    return data;
  } catch (err) {
    // 演示模式（GitHub Pages 静态版）：后端不可用，任意非空账号密码可进入演示管理界面
    markDemoMode();
    // eslint-disable-next-line no-console
    console.warn('[demo] 演示模式登录：当前为静态演示版，数据不会被真实保存');
    if (account && password) {
      return { success: true };
    }
    return { success: false };
  }
}
