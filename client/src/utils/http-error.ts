/** 从未知异常中提取 HTTP 状态码（用于识别 403 等语义状态） */
export function getErrorStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return undefined;
  }
  const { response } = error as { response?: unknown };
  if (!response || typeof response !== 'object' || !('status' in response)) {
    return undefined;
  }
  const { status } = response as { status?: unknown };
  return typeof status === 'number' ? status : undefined;
}
