import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  ScrollText,
  Plus,
  Pencil,
  Trash2,
  CalendarClock,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { useAdminAuth } from '@client/src/contexts/AdminAuthContext';
import { useLocalStorageList } from '@client/src/hooks/useLocalStorageList';
import { showConfirm } from '@lark-apaas/client-toolkit';

interface ChangelogItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'system_changelog_v1';

const INITIAL_ITEMS: ChangelogItem[] = [
  {
    id: 'init-1',
    title: '上线管理员登录功能',
    content:
      '导航栏右上角新增管理员登录按钮，验证账户密码通过后可查看管理员专属内容。',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
  },
  {
    id: 'init-2',
    title: '集成视频解析档案库',
    content:
      '新增视频解析档案库入口，管理员登录后可查看视频解析档案记录并跳转档案库网站进行管理。',
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'init-3',
    title: '新增系统更新日志页',
    content:
      '新增系统更新日志页面，管理员登录后可查看并维护网站历次更新记录。',
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z',
  },
];

const ChangelogPage = () => {
  const { isLoggedIn } = useAdminAuth();
  const { items, addItem, updateItem, removeItem } = useLocalStorageList<
    ChangelogItem
  >(STORAGE_KEY, INITIAL_ITEMS);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const openCreate = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setDialogOpen(true);
  };

  const openEdit = (item: ChangelogItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date().toISOString();
    if (editingId) {
      updateItem(editingId, {
        title: title.trim(),
        content: content.trim(),
        updatedAt: now,
      });
    } else {
      addItem({
        id: `changelog-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: title.trim(),
        content: content.trim(),
        createdAt: now,
        updatedAt: now,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!await showConfirm('确定要删除这条更新日志吗？')) return;
    removeItem(id);
  };

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const sorted = [...items].sort(
    (a: ChangelogItem, b: ChangelogItem) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">系统更新日志</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            记录网站历次功能更新与优化 · 仅管理员可见与维护
          </p>
        </div>
        <Button onClick={openCreate} aria-label="新增更新日志" className="w-full justify-center sm:w-auto">
          <Plus size={16} />
          新增日志
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card p-8 text-center sm:p-12">
          <ScrollText size={32} className="text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">暂无更新日志</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4" data-ai-section-type="card-list">
          {sorted.map((item: ChangelogItem) => (
            <Card key={item.id} className="p-4 sm:p-5 max-sm:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock size={12} />
                    {dayjs(item.createdAt).format('YYYY年MM月DD日 HH:mm')}
                    {item.updatedAt !== item.createdAt && (
                      <span className="ml-2">
                        更新于 {dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm')}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {item.content}
                  </p>
                </div>
                 <div className="flex shrink-0 gap-2">
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => openEdit(item)}
                     aria-label={`编辑 ${item.title}`}
                     className="min-h-10 min-w-10"
                   >
                     <Pencil size={16} />
                   </Button>
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => handleDelete(item.id)}
                     aria-label={`删除 ${item.title}`}
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
              {editingId ? '编辑更新日志' : '新增更新日志'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="changelog-title">
                更新标题 <span className="text-destructive">*</span>
              </Label>
               <Input
                 id="changelog-title"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="例如：上线管理员登录功能"
                 className="text-[16px] sm:text-sm"
               />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="changelog-content">
                更新内容 <span className="text-destructive">*</span>
              </Label>
               <Textarea
                 id="changelog-content"
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 placeholder="描述本次更新的具体内容..."
                 rows={5}
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
              disabled={!title.trim() || !content.trim()}
            >
              {editingId ? '保存修改' : '新增'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangelogPage;
