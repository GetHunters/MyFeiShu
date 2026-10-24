# 项目记忆

## RLS 受限表 + Drizzle `.returning()` 导致 42501（SQLSTATE 42501 ExecWithCheckOptions）

- 现象：向 RLS 受限表（如 daily_summary，SELECT 策略仅允许管理员）执行 `INSERT ... RETURNING` 时报 `new row violates row-level security policy`，即使 INSERT 策略的 WITH CHECK 条件已满足；去掉 RETURNING 则插入成功。
- 根因：PostgreSQL 中 `INSERT ... RETURNING` 要求新行同时通过该角色适用的 SELECT 策略（RETURNING 可见性检查），OpenAPI 系统身份（`app.user_id='-1'`）不在仅管理员的 SELECT 策略内，故被拒。项目里 daily_report/daily_maintenance 因 SELECT 策略无条件（USING true）不受影响。
- 修复：把写入方的 SELECT 策略放宽为 `USING (current_setting('app.user_id', true) IN ('<管理员ID>', '-1'))`，让系统推送身份可读（支撑 RETURNING），普通用户仍不可见。已验证 201 + 覆盖更新正常。

## 沙箱内测试 /openapi 接口必须用默认 auth 模式

- 现象：api_request 用 authMode:'anon' 打 /openapi/* 时以匿名角色落库，写操作被 RLS 拒（42501），且与生产网关 API Key 链路（系统身份 user_id=-1）不一致。
- 修复：不传 authMode（默认），工具会对 /openapi 注入 `x-larkgw-suda-webuser: {"user_id":-1,...}`，等价线上 api-key 下游身份。
