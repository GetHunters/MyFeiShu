/**
 * 演示数据层（GitHub Pages 静态部署专用）
 *
 * 当后端 API 不可用（静态托管、无后端服务）时，前端自动切换为演示数据，
 * 保证页面完整可浏览。线上平台版后端正常时，永远不会触发演示模式。
 */
import type {
  DailyReportDetail,
  MaintenanceItem,
  MesSummaryItem,
  WorkSummaryItem,
} from '@shared/api.interface';

let demoMode = false;

export function isDemoMode(): boolean {
  return demoMode;
}

export function markDemoMode(): void {
  if (!demoMode) {
    demoMode = true;
    // eslint-disable-next-line no-console
    console.warn('[demo] 后端不可用，已切换为演示数据模式（GitHub Pages 静态版）');
  }
}

/* ===== 示例日报 HTML（与线上推送格式一致，含 admin-only 区块） ===== */
const demoReportHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>每日工作汇总</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; background: #f6f4ff; padding: 20px 12px; color: #334155; }
  .container { max-width: 720px; margin: 0 auto; }
  .title { text-align: center; font-size: 22px; font-weight: bold; color: #a78bfa; margin: 6px 0 20px; }
  .person-card { background: #ffffff; border: 1px solid #ddd6fe; border-radius: 14px; padding: 16px 18px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
  .person-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 2px solid #ddd6fe; margin-bottom: 12px; }
  .person-name { font-size: 18px; font-weight: bold; color: #a78bfa; }
  .person-date { font-size: 12.5px; color: #94a3b8; }
  .work-label, .plan-label { font-size: 12.5px; font-weight: bold; color: #a78bfa; margin: 4px 0 6px; }
  .work-item { display: flex; align-items: flex-start; gap: 9px; font-size: 15px; line-height: 1.8; padding: 5px 0; }
  .work-item .tag { flex-shrink: 0; display: inline-block; font-weight: bold; font-size: 13px; border: none; border-radius: 9px; padding: 1px 10px; margin-top: 3px; line-height: 1.7; }
  .work-item .work-text { flex: 1; min-width: 0; }
  .plan-item { display: flex; gap: 6px; font-size: 14.5px; color: #553c9a; line-height: 1.8; padding: 3px 0; }
  .stats { background: #ffffff; border: 1px solid #ddd6fe; border-radius: 14px; overflow: hidden; margin-top: 4px; }
  .stats-title { background: #a78bfa; color: #ffffff; font-size: 15px; font-weight: bold; padding: 11px 18px; }
  table.stats-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .stats-table td { padding: 9px 12px; border-bottom: 1px solid #ddd6fe; text-align: center; }
  .balance { font-size: 13px; color: #a78bfa; line-height: 1.9; padding: 12px 18px; }
</style>
</head>
<body>
<div class="container">
  <div class="title">每日工作汇总</div>
  <div class="person-card">
    <div class="person-header"><span class="person-name">阮文型</span><span class="person-date">2026年10月23日</span></div>
    <div class="work-label">工作记录</div>
    <div class="work-item"><span class="tag" style="background:#fdeaea;color:#c53030;">维修</span><span class="work-text">完成T151机器膜带断裂故障维修。</span></div>
    <div class="work-item"><span class="tag" style="background:#fdeaea;color:#c53030;">维修</span><span class="work-text">完成T111机器膜带跑偏故障维修。</span></div>
    <div class="work-item"><span class="tag" style="background:#fdeaea;color:#c53030;">维修</span><span class="work-text">完成T152机器烤箱夹断线故障维修。</span></div>
    <div class="work-item"><span class="tag" style="background:#fdeaea;color:#c53030;">维修</span><span class="work-text">完成T152机器膜带断裂故障维修。</span></div>
    <div class="plan-label">明日工作计划</div>
    <div class="plan-item">• 按计划保养设备每人每班2台包带机KPI检修</div>
    <div class="plan-item">• 每人每天2遍设备点检</div>
    <div class="plan-item">• 完善MES系统保养记录</div>
    <div class="plan-item">• 处理产线突发的故障</div>
    <div class="plan-item">• 完成上级安排的其他事宜</div>
  </div>
  <div class="person-card">
    <div class="person-header"><span class="person-name">郑庭进</span><span class="person-date">2026年10月23日</span></div>
    <div class="work-label">工作记录</div>
    <div class="work-item"><span class="tag" style="background:#fdf3e0;color:#b7791f;">其他</span><span class="work-text">完成电表数据抄录与录入。</span></div>
    <div class="work-item"><span class="tag" style="background:#fdf3e0;color:#b7791f;">其他</span><span class="work-text">跟进仓库门维修施工：施工方到场对仓库门进行维修（附图）。</span></div>
    <div class="work-item"><span class="tag" style="background:#fdeaea;color:#c53030;">维修</span><span class="work-text">完成T122机器膜带放卷轴卡住故障维修（与阮某共同完成）。</span></div>
    <div class="work-item"><span class="tag" style="background:#fdeaea;color:#c53030;">维修</span><span class="work-text">完成T127机器烤箱夹断线故障维修（与阮某共同完成）。</span></div>
    <div class="plan-label">明日工作计划</div>
    <div class="plan-item">• 每人每天2遍设备点检</div>
    <div class="plan-item">• 完善MES系统保养记录</div>
    <div class="plan-item">• 处理产线突发的故障</div>
    <div class="plan-item">• 完成上级安排的其他事宜</div>
    <div class="plan-item">• 整理整顿6S</div>
  </div>
  <div class="person-card">
    <div class="person-header"><span class="person-name">陈文成</span><span class="person-date">2026年10月23日</span></div>
    <div class="work-label">工作记录</div>
    <div class="work-item"><span class="tag" style="background:#fdf3e0;color:#b7791f;">其他</span><span class="work-text">完成一楼4台押出机电气安全隐患部位防护罩安装。</span></div>
    <div class="work-item"><span class="tag" style="background:#e6f7ee;color:#2f855a;">保养</span><span class="work-text">完成T-153设备检查与保养。</span></div>
    <div class="work-item"><span class="tag" style="background:#fdeaea;color:#c53030;">维修</span><span class="work-text">完成T-149机器薄膜断裂故障维修。</span></div>
    <div class="work-item"><span class="tag" style="background:#fdf3e0;color:#b7791f;">其他</span><span class="work-text">完成一楼变形电缆桥架位置调整。</span></div>
    <div class="plan-label">明日工作计划</div>
    <div class="plan-item">• 按计划保养设备每人每班2台包带机KPI检修</div>
    <div class="plan-item">• 每人每天2遍设备点检</div>
    <div class="plan-item">• 完善MES系统保养记录</div>
    <div class="plan-item">• 处理产线突发的故障</div>
    <div class="plan-item">• 完成上级安排的其他事宜</div>
  </div>
  <div class="stats admin-only">
    <div class="stats-title">工作量统计</div>
    <table class="stats-table">
      <tr style="background:#f5f3ff;"><td style="text-align:center;font-weight:bold;">姓名</td><td style="text-align:center;">维修（项）</td><td style="text-align:center;">保养（项）</td><td style="text-align:center;">其他（项）</td><td style="text-align:center;">合计（项）</td></tr>
      <tr style="background:#ffffff;"><td style="text-align:center;font-weight:bold;">阮文型</td><td style="text-align:center;">4</td><td style="text-align:center;">0</td><td style="text-align:center;">0</td><td style="text-align:center;font-weight:bold;">4</td></tr>
      <tr style="background:#f5f3ff;"><td style="text-align:center;font-weight:bold;">郑庭进</td><td style="text-align:center;">2</td><td style="text-align:center;">0</td><td style="text-align:center;">2</td><td style="text-align:center;font-weight:bold;">4</td></tr>
      <tr style="background:#ffffff;"><td style="text-align:center;font-weight:bold;">陈文成</td><td style="text-align:center;">1</td><td style="text-align:center;">1</td><td style="text-align:center;">2</td><td style="text-align:center;font-weight:bold;">4</td></tr>
      <tr style="background:#f5f3ff;font-weight:bold;"><td style="text-align:center;">总计</td><td style="text-align:center;">7</td><td style="text-align:center;">1</td><td style="text-align:center;">4</td><td style="text-align:center;">12</td></tr>
    </table>
    <div class="balance">工作量平衡说明：各成员工作量记录数差距未超过2项，无需调整。</div>
  </div>
</div>
</body>
</html>`;

const demoMesHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>MES每日总结</title></head>
<body style="font-family:sans-serif;background:#f0f9ff;padding:20px;color:#334155;">
<h2 style="color:#38bdf8;text-align:center;">MES 每日总结（示例）</h2>
<div style="background:#fff;border:1px solid #bae6fd;border-radius:14px;padding:16px;margin-bottom:14px;">
  <p><b>生产情况</b>：产线整体运行稳定，包带机 KPI 检修按计划完成。</p>
  <p><b>设备异常</b>：T151 膜带断裂 1 起，已当日修复，无停机影响。</p>
  <p><b>数据录入</b>：MES 保养记录、电表数据均已录入完成。</p>
</div>
<div style="background:#fff;border:1px solid #bae6fd;border-radius:14px;padding:16px;">
  <p><b>明日计划</b>：继续按计划推进包带机 KPI 检修与设备点检。</p>
</div>
</body>
</html>`;

const demoSummaryHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>我的飞书工作汇总</title></head>
<body style="font-family:sans-serif;background:#f2fdf5;padding:20px;color:#334155;">
<h2 style="color:#166534;text-align:center;">我的飞书工作汇总（脱敏版 · 示例）</h2>
<div style="background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:14px;margin-bottom:12px;">
  <p style="color:#166534;font-weight:bold;">10/23 08:30 · 协调安排</p>
  <p>在管理群安排当日生技工作重点，明确三人分工与检修计划。</p>
  <p style="color:#94a3b8;font-size:12px;">来源：管理群</p>
</div>
<div style="background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:14px;margin-bottom:12px;">
  <p style="color:#dd6b20;font-weight:bold;">10/23 10:15 · 工作处理</p>
  <p>跟进 T151 膜带断裂故障处理，确认修复完成并记录于 MES。</p>
  <p style="color:#94a3b8;font-size:12px;">来源：生技群</p>
</div>
<div style="background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:14px;">
  <p style="color:#38a169;font-weight:bold;">10/23 17:40 · 跟进反馈</p>
  <p>收集三人当日工作汇报，整理生技日报并推送。</p>
  <p style="color:#94a3b8;font-size:12px;">来源：生技群</p>
</div>
</body>
</html>`;

const demoMaintenanceHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>每日工作</title></head>
<body style="font-family:sans-serif;background:#f6f4ff;padding:20px;color:#334155;">
<h2 style="color:#a78bfa;text-align:center;">每日工作（示例）</h2>
<div style="background:#fff;border:1px solid #ddd6fe;border-radius:14px;padding:14px;">
  <p><span style="background:#fdeaea;color:#c53030;border-radius:9px;padding:1px 10px;font-weight:bold;">维修</span> 完成T-149机器薄膜断裂故障维修。</p>
  <p><span style="background:#e6f7ee;color:#2f855a;border-radius:9px;padding:1px 10px;font-weight:bold;">保养</span> 完成T-153设备检查与保养。</p>
</div>
</body>
</html>`;

/* ===== 演示数据 ===== */
const nowIso = new Date().toISOString();

const demoReports: DailyReportDetail[] = [
  { id: 'demo-report-1', title: '生技部每日工作汇总 2026年10月23日', reportDate: '2026-10-23', source: 'manual', updatedAt: '2026-10-23T19:06:21+07:00', htmlContent: demoReportHtml },
  { id: 'demo-report-2', title: '生技部每日工作汇总 2026年10月22日', reportDate: '2026-10-22', source: 'openapi', updatedAt: '2026-10-22T19:05:10+07:00', htmlContent: demoReportHtml },
  { id: 'demo-report-3', title: '生技部每日工作汇总 2026年10月21日', reportDate: '2026-10-21', source: 'openapi', updatedAt: '2026-10-21T19:04:55+07:00', htmlContent: demoReportHtml },
];

const demoMaintenance: MaintenanceItem[] = [
  { id: 'demo-maint-1', title: '每日工作 2026年10月23日', recordDate: '2026-10-23', source: 'manual', updatedAt: '2026-10-23T19:10:00+07:00' },
  { id: 'demo-maint-2', title: '每日工作 2026年10月22日', recordDate: '2026-10-22', source: 'openapi', updatedAt: '2026-10-22T19:09:30+07:00' },
];

const demoMesSummaries: MesSummaryItem[] = [
  { id: 'demo-mes-1', title: 'MES每日总结 2026年10月23日', recordDate: '2026-10-23', source: 'openapi', updatedAt: '2026-10-23T20:10:00+07:00' },
  { id: 'demo-mes-2', title: 'MES每日总结 2026年10月22日', recordDate: '2026-10-22', source: 'openapi', updatedAt: '2026-10-22T20:05:00+07:00' },
];

const demoSummaries: WorkSummaryItem[] = [
  { id: 'demo-sum-1', title: '我的飞书工作汇总 2026年10月23日', summaryDate: '2026-10-23', source: 'manual', updatedAt: '2026-10-23T19:48:20+07:00' },
  { id: 'demo-sum-2', title: '我的飞书工作汇总 2026年10月22日', summaryDate: '2026-10-22', source: 'openapi', updatedAt: '2026-10-22T19:47:50+07:00' },
];

export const demoData = {
  reports: demoReports,
  maintenance: demoMaintenance,
  mesSummaries: demoMesSummaries,
  summaries: demoSummaries,
  mesDetailHtml: demoMesHtml,
  summaryDetailHtml: demoSummaryHtml,
  maintenanceDetailHtml: demoMaintenanceHtml,
  createdAt: nowIso,
};
