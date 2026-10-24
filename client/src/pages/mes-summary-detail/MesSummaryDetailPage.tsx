import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { fetchMesSummaryDetail } from '@client/src/api/mes-summary';
import type { MesSummaryDetail } from '@shared/api.interface';
import { logger } from '@lark-apaas/client-toolkit/logger';

const MesSummaryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MesSummaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        setData(await fetchMesSummaryDetail(id));
      } catch (err) {
        setError('MES 每日总结加载失败，可能已被删除');
        logger.error('加载MES每日总结详情失败', err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <Link
        to="/mes-summary"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        返回 MES 每日总结
      </Link>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border bg-card p-8 text-sm text-muted-foreground sm:p-12">
          <Spinner className="size-4" />
          MES 每日总结加载中...
        </div>
      ) : error || !data ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center sm:p-12">
          <p className="text-sm text-destructive">
            {error ?? 'MES 每日总结不存在'}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/mes-summary">返回 MES 每日总结</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="min-w-0 w-full">
            <h1 className="text-xl font-semibold break-words sm:text-2xl">{data.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={12} />
                {dayjs(data.recordDate).format('YYYY年MM月DD日')}
              </span>
              <Badge variant={data.source === 'manual' ? 'secondary' : 'outline'}>
                {data.source === 'manual' ? '手动上传' : '自动推送'}
              </Badge>
              <span>更新于 {dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
            </div>
          </div>
          <iframe
            title={data.title}
            srcDoc={data.htmlContent}
            sandbox=""
            className="h-[65vh] w-full rounded-xl border bg-white sm:h-[75vh]"
          />
        </div>
      )}
    </div>
  );
};

export default MesSummaryDetailPage;
