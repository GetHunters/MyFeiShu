import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { CalendarDays, FileText, RefreshCw, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { fetchReports } from '@client/src/api/reports';
import type { DailyReportSummary } from '@shared/api.interface';
import { logger } from '@lark-apaas/client-toolkit/logger';

const ReportsPage = () => {
  const [items, setItems] = useState<DailyReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReports();
      setItems(data.items);
    } catch (err) {
      setError('日报列表加载失败，请稍后重试');
      logger.error('加载日报列表失败', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">日报列表</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            按日期倒序展示所有工作日报，点击卡片查看全文
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full justify-center sm:w-auto">
          <Link to="/upload">
            <Upload size={16} />
            上传日报
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border bg-card p-8 text-sm text-muted-foreground sm:p-12">
          <Spinner className="size-4" />
          加载中...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center sm:p-12">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw size={16} />
            重试
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card p-8 text-center sm:p-12">
          <FileText size={32} className="text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            还没有任何日报，去「上传日报」添加第一篇吧
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4" data-ai-section-type="card-list">
          {items.map((item: DailyReportSummary) => (
            <Link key={item.id} to={`/reports/${item.id}`} className="group">
              <Card className="flex items-center gap-4 p-5 transition-colors group-hover:border-primary/40 max-sm:shadow-sm">
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary max-sm:bg-[#f5f3ff]">
                  <span className="text-base font-semibold leading-none">
                    {dayjs(item.reportDate).format('DD')}
                  </span>
                  <span className="mt-0.5 text-[10px] leading-none">
                    {dayjs(item.reportDate).format('YYYY/MM')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={12} />
                      {dayjs(item.reportDate).format('YYYY年MM月DD日')}
                    </span>
                    <Badge variant={item.source === 'manual' ? 'secondary' : 'outline'}>
                      {item.source === 'manual' ? '手动上传' : '豆包推送'}
                    </Badge>
                    <span>更新于 {dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
