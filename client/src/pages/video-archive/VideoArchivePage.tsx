import { ExternalLink, Film, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@client/src/contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';

const ARCHIVE_URL =
  'https://zcnua2sq60xq.doubao.link/app/app_17gm48er4z5';

const VideoArchivePage = () => {
  const { isLoggedIn } = useAdminAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const openInNewWindow = () => {
    window.open(ARCHIVE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem-2.5rem)] flex-col">
       <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8">
         <div>
           <h1 className="text-xl font-semibold sm:text-2xl">视频解析档案库</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            集中管理所有视频解析记录，支持搜索筛选与详情展开 · 仅管理员可见
          </p>
        </div>
        <Button onClick={openInNewWindow} aria-label="在新窗口打开档案库" className="w-full justify-center sm:w-auto">
          <ExternalLink size={16} />
          在新窗口打开
        </Button>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 pb-6">
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            下方内嵌展示档案库内容。若页面显示空白，可能是目标站点限制了内嵌访问，
            可点击右上角「在新窗口打开」按钮直接在新标签页中操作。
          </p>
        </div>
        <iframe
          src={ARCHIVE_URL}
          title="视频解析档案库"
          className="h-full min-h-[400px] w-full flex-1 rounded-xl border bg-white shadow-sm sm:min-h-[500px]"
        />
      </div>
    </div>
  );
};

export default VideoArchivePage;
