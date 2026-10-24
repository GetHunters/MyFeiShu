import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { CalendarDays, RefreshCw, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { fetchMesSummaries } from '@client/src/api/mes-summary';
import type { MesSummaryItem } from '@shared/api.interface';
import { logger } from '@lark-apaas/client-toolkit/logger';

const MesSummaryPage = () => {
  const [items, setItems] = useState<MesSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMesSummaries();
      setItems(data.items);
    } catch (err) {
      setError('MES 每日总结加载失败，请稍后重试');
      logger.error('加载MES每日总结列表失败', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold sm:text-2xl">MES 每日总结</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          按日期倒序展示 MES 每日总结，由外部推送自动更新，点击卡片查看全文
        </p>
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
          <ListChecks size={32} className="text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            暂无 MES 每日总结，推送后将自动显示
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4" data-ai-section-type="card-list">
          {items.map((item: MesSummaryItem) => (
            <Link
              key={item.id}
              to={`/mes-summary/${item.id}`}
              className="group"
            >
              <Card className="flex items-center gap-4 p-4 transition-colors group-hover:border-primary/40 sm:p-5 max-sm:shadow-sm">
                <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-12 max-sm:bg-[#f5f3ff]">
                  <span className="text-base font-semibold leading-none">
                    {dayjs(item.recordDate).format('DD')}
                  </span>
                  <span className="mt-0.5 text-[10px] leading-none">
                    {dayjs(item.recordDate).format('YYYY/MM')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={12} />
                      {dayjs(item.recordDate).format('YYYY年MM月DD日')}
                    </span>
                    <Badge variant={item.source === 'manual' ? 'secondary' : 'outline'}>
                      {item.source === 'manual' ? '手动上传' : '自动推送'}
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

export default MesSummaryPage;
