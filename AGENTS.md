# 工作日报网站

## 应用概览

公网可随地访问的个人工作内容网站，含三类内容，均为独立 HTML 文件：

1. 每日工作日报：站内手动上传（登录用户）+ 豆包 OpenAPI 推送，访客可浏览
2. 每日保养记录：仅豆包 OpenAPI 推送，访客可浏览（导航入口）
3. 每日工作总结：仅豆包 OpenAPI 推送，仅管理员（userId 见 server/common/constants/admin-user.ts）可查看，导航不显示入口，直接 URL /admin/summaries 访问
4. MES 每日总结：外部 OpenAPI 推送，所有用户可见，导航有入口

## 功能模块

- `server/modules/reports/`：日报业务接口（公开读 + 登录态写）
- `server/modules/reports/*.openapi.controller.ts`：豆包推送 OpenAPI
- `server/modules/maintenance/`：保养记录（公开读，POST /openapi/maintenance 推送）
- `server/modules/mes-summary/`：MES 每日总结（公开读，POST /openapi/mes-summary 推送，按 record_date 唯一覆盖更新）
- `server/modules/summaries/`：工作总结（管理员读：@NeedLogin + ADMIN_USER_ID 校验，POST /openapi/summaries 推送）
- `client/src/pages/reports/`：日报列表页（首页）
- `client/src/pages/report-detail/`：日报详情页（iframe 渲染 HTML 内容，隔离样式脚本）
- `client/src/pages/upload/`：上传/管理日报页
- `client/src/pages/maintenance/` + `maintenance-detail/`：保养记录列表与详情
- `client/src/pages/mes-summary/` + `mes-summary-detail/`：MES 每日总结列表与详情（公开，所有用户可见）
- `client/src/pages/summaries/`：工作总结列表与详情（隐藏路由 /admin/summaries，403 时显示无权限态）
- `client/src/utils/http-error.ts`：从 axios 异常提取 HTTP 状态码

## 数据模型

- 表 `daily_report`：`title`、`report_date`（业务日期，唯一）、`html_content`、`source`（manual/openapi）、系统字段
- 表 `daily_maintenance`：`title`、`record_date`（唯一）、`html_content`、`source`（openapi）、系统字段；RLS 同 daily_report（公开读）
- 表 `daily_mes_summary`：`title`、`record_date`（唯一）、`html_content`、`source`（openapi）、系统字段；RLS 同 daily_report（公开读）
- 表 `daily_summary`：`title`、`summary_date`（唯一）、`html_content`、`source`（openapi）、系统字段；RLS：SELECT 仅管理员 userId 或系统身份 -1（支撑 INSERT RETURNING），INSERT/UPDATE 仅系统身份 -1

## 设计规范

- 风格：现代简约、内容优先的阅读型站点；单套浅色色彩系统，无深浅色切换
- 主色：`primary` 语义 token（indigo 系）；背景 `bg-background`，卡片 `bg-card` + `border` + `rounded-xl`
- 排版：正文 `text-sm`，页面标题 `text-2xl font-semibold`，次级说明 `text-muted-foreground`
- 间距：页面容器 `max-w-4xl mx-auto px-4 py-8`；卡片内边距 `p-5`；并列元素间距用 `gap-4`
- 顶栏：sticky、`border-b`、白色带 `backdrop-blur`；左侧站点名，右侧 NavLink 导航（active 高亮）
- 图标只用 lucide-react；用户信息展示用 business-ui 组件
- 响应式：列表在窄屏单列，宽屏正常布局

## 约定

- HTML 日报内容一律存数据库 text 字段，详情页用 `<iframe srcDoc>` 渲染，禁止 `dangerouslySetInnerHTML`
- 前端请求一律走 `axiosForBackend`；页面跳转用 NavLink/Link/useNavigate
- 日报列表按 `report_date` 倒序
