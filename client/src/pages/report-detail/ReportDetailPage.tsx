import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CalendarDays,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { deleteReport, fetchReportDetail } from '@client/src/api/reports';
import type { DailyReportDetail } from '@shared/api.interface';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { useAdminAuth } from '@client/src/contexts/AdminAuthContext';
import { filterAdminBlocks } from '@client/src/utils/filter-admin-blocks';

const ReportDetailPage = () => {
  const { isLoggedIn: isAdmin } = useAdminAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DailyReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        setData(await fetchReportDetail(id));
      } catch (err) {
        setError('日报加载失败，可能已被删除');
        logger.error('加载日报详情失败', err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteReport(id);
      toast.success('日报已删除');
      navigate('/');
    } catch (err) {
      toast.error('删除失败，请确认已登录后重试');
      logger.error('删除日报失败', err);
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        返回列表
      </Link>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border bg-card p-8 text-sm text-muted-foreground sm:p-12">
          <Spinner className="size-4" />
          日报加载中...
        </div>
      ) : error || !data ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center sm:p-12">
          <p className="text-sm text-destructive">{error ?? '日报不存在'}</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/">返回列表</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 w-full">
              <h1 className="text-xl font-semibold sm:text-2xl break-words">{data.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={12} />
                  {dayjs(data.reportDate).format('YYYY年MM月DD日')}
                </span>
                <Badge variant={data.source === 'manual' ? 'secondary' : 'outline'}>
                  {data.source === 'manual' ? '手动上传' : '豆包推送'}
                </Badge>
                <span>更新于 {dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button asChild variant="outline" size="sm" className="w-full justify-center sm:w-auto">
                <Link to="/">
                  <RefreshCw size={16} />
                  返回列表
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deleting} className="w-full justify-center sm:w-auto">
                    <Trash2 size={16} />
                    {deleting ? '删除中...' : '删除'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确定删除这篇日报吗？</AlertDialogTitle>
                    <AlertDialogDescription>
                      将删除「{data.title}」（{data.reportDate}），删除后不可恢复。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void handleDelete()}>
                      确认删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <iframe
            title={data.title}
            srcDoc={filterAdminBlocks(data.htmlContent, isAdmin)}
            sandbox=""
            className="h-[65vh] w-full rounded-xl border bg-white sm:h-[75vh]"
          />
        </div>
      )}
    </div>
  );
};

export default ReportDetailPage;
