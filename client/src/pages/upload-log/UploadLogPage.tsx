import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  UploadCloud,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminAuth } from '@client/src/contexts/AdminAuthContext';
import { useLocalStorageList } from '@client/src/hooks/useLocalStorageList';
import { showConfirm } from '@lark-apaas/client-toolkit';

type UploadLogStatus = 'success' | 'failed' | 'pending';

interface UploadLogItem {
  id: string;
  uploadDate: string;
  uploadTime: string;
  content: string;
  status: UploadLogStatus;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'upload_log_v1';

const statusLabel: Record<UploadLogStatus, string> = {
  success: '上传成功',
  failed: '上传失败',
  pending: '进行中',
};

const statusVariant: Record<UploadLogStatus, 'default' | 'destructive' | 'secondary'> = {
  success: 'default',
  failed: 'destructive',
  pending: 'secondary',
};

const StatusIcon = ({ status }: { status: UploadLogStatus }) => {
  if (status === 'success')
    return <CheckCircle2 size={14} className="text-primary" />;
  if (status === 'failed')
    return <AlertCircle size={14} className="text-destructive" />;
  return <Clock size={14} className="text-muted-foreground" />;
};

const UploadLogPage = () => {
  const { isLoggedIn } = useAdminAuth();
  const { items, addItem, updateItem, removeItem } = useLocalStorageList<
    UploadLogItem
  >(STORAGE_KEY, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [uploadTime, setUploadTime] = useState(
    new Date().toTimeString().slice(0, 5),
  );
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<UploadLogStatus>('success');
  const [remark, setRemark] = useState('');

  const resetForm = () => {
    const now = new Date();
    setUploadDate(now.toISOString().slice(0, 10));
    setUploadTime(now.toTimeString().slice(0, 5));
    setContent('');
    setStatus('success');
    setRemark('');
  };

  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (item: UploadLogItem) => {
    setEditingId(item.id);
    setUploadDate(item.uploadDate);
    setUploadTime(item.uploadTime);
    setContent(item.content);
    setStatus(item.status);
    setRemark(item.remark ?? '');
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!uploadDate || !uploadTime || !content.trim()) return;
    const now = new Date().toISOString();
    if (editingId) {
      updateItem(editingId, {
        uploadDate,
        uploadTime,
        content: content.trim(),
        status,
        remark: remark.trim() || undefined,
        updatedAt: now,
      });
    } else {
      addItem({
        id: `upload-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        uploadDate,
        uploadTime,
        content: content.trim(),
        status,
        remark: remark.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!await showConfirm('确定要删除这条上传记录吗？')) return;
    removeItem(id);
  };

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const sorted = [...items].sort((a: UploadLogItem, b: UploadLogItem) => {
    const aKey = `${a.uploadDate} ${a.uploadTime}`;
    const bKey = `${b.uploadDate} ${b.uploadTime}`;
    return bKey.localeCompare(aKey);
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">每日上传记录日志</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            记录日报上传/更新的日期、时间、内容与状态 · 仅管理员可见与维护
          </p>
        </div>
        <Button onClick={openCreate} aria-label="新增上传记录" className="w-full justify-center sm:w-auto">
          <Plus size={16} />
          新增记录
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card p-8 text-center sm:p-12">
          <UploadCloud size={32} className="text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            暂无上传记录，点击右上角新增第一条
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4" data-ai-section-type="card-list">
          {sorted.map((item: UploadLogItem) => (
            <Card key={item.id} className="p-4 sm:p-5 max-sm:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{item.content}</h3>
                    <Badge variant={statusVariant[item.status]}>
                      <StatusIcon status={item.status} />
                      {statusLabel[item.status]}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {dayjs(item.uploadDate).format('YYYY年MM月DD日')}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {item.uploadTime}
                    </span>
                  </div>
                  {item.remark && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      备注：{item.remark}
                    </p>
                  )}
                </div>
                 <div className="flex shrink-0 gap-2">
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => openEdit(item)}
                     aria-label={`编辑 ${item.content}`}
                     className="min-h-10 min-w-10"
                   >
                     <Pencil size={16} />
                   </Button>
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => handleDelete(item.id)}
                     aria-label={`删除 ${item.content}`}
                     className="min-h-10 min-w-10 text-destructive hover:text-destructive"
                   >
                     <Trash2 size={16} />
                   </Button>
                 </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? '编辑上传记录' : '新增上传记录'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="upload-date">
                  上传日期 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="upload-date"
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="text-[16px] sm:text-sm"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="upload-time">
                  上传时间 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="upload-time"
                  type="time"
                  value={uploadTime}
                  onChange={(e) => setUploadTime(e.target.value)}
                  className="text-[16px] sm:text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="upload-content">
                上传内容 <span className="text-destructive">*</span>
              </Label>
              <Input
                 id="upload-content"
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 placeholder="例如：2025年1月20日工作日报"
                 className="text-[16px] sm:text-sm"
               />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="upload-status">
                结果状态 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as UploadLogStatus)}
              >
                <SelectTrigger id="upload-status" className="text-[16px] sm:text-sm">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="success">上传成功</SelectItem>
                  <SelectItem value="failed">上传失败</SelectItem>
                  <SelectItem value="pending">进行中</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="upload-remark">备注</Label>
               <Textarea
                 id="upload-remark"
                 value={remark}
                 onChange={(e) => setRemark(e.target.value)}
                 placeholder="可选，补充说明..."
                 rows={3}
                 className="text-[16px] sm:text-sm"
               />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              aria-label="取消"
            >
              <X size={14} />
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!uploadDate || !uploadTime || !content.trim()}
            >
              {editingId ? '保存修改' : '新增'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadLogPage;
