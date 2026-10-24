import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { CalendarIcon, FileUp, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { upsertReport } from '@client/src/api/reports';
import type { UpsertDailyReportRequest } from '@shared/api.interface';
import { useAdminAuth } from '@client/src/contexts/AdminAuthContext';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { cn } from '@/lib/utils';

const uploadSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  reportDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '请选择日报日期'),
  htmlContent: z.string().min(1, '请选择日报 HTML 文件'),
});

type UploadFormData = z.infer<typeof uploadSchema>;

function parseTitleFromHtml(html: string, fileName: string): string {
  const match = /<title>([^<]*)<\/title>/i.exec(html);
  if (match?.[1]?.trim()) return match[1].trim();
  return fileName.replace(/\.html?$/i, '');
}

const UploadPage = () => {
  const { isLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      reportDate: dayjs().format('YYYY-MM-DD'),
      htmlContent: '',
    },
  });

  const htmlError = form.formState.errors.htmlContent?.message;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.html?$/i.test(file.name)) {
      toast.error('请选择 .html 格式的日报文件');
      return;
    }
    try {
      const text = await file.text();
      if (!text.trim()) {
        toast.error('文件内容为空');
        return;
      }
      setFileName(file.name);
      form.setValue('htmlContent', text, { shouldValidate: true });
      if (!form.getValues('title')) {
        form.setValue('title', parseTitleFromHtml(text, file.name));
      }
    } catch (err) {
      toast.error('读取文件失败，请重试');
      logger.error('读取日报文件失败', err);
    }
  };

  const onSubmit = form.handleSubmit(async (data: UploadFormData) => {
    setSubmitting(true);
    try {
      const request: UpsertDailyReportRequest = {
        title: data.title,
        reportDate: data.reportDate,
        htmlContent: data.htmlContent,
      };
      const result = await upsertReport(request);
      toast.success(
        result.overwritten
          ? `已覆盖 ${result.reportDate} 的已有日报`
          : '日报上传成功',
      );
      navigate(`/reports/${result.id}`);
    } catch (err) {
      toast.error('上传失败，请确认已登录后重试');
      logger.error('上传日报失败', err);
      setSubmitting(false);
    }
  });

  return !isLoggedIn ? (
    <Navigate to="/" replace />
  ) : (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold sm:text-2xl">上传日报</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          选择本地 HTML 日报文件，上传后立即出现在日报列表；同一天再次上传会覆盖当天日报
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>日报信息</CardTitle>
          <CardDescription>
            标题会自动从 HTML 文件的 title 标签提取，可手动修改
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 sm:p-10',
                  htmlError && 'border-destructive',
                )}
              >
                {fileName ? (
                  <FileText size={32} className="text-primary" />
                ) : (
                  <FileUp size={32} className="text-muted-foreground/50" />
                )}
                <div className="text-sm">
                  {fileName ? (
                    <span className="font-medium">{fileName}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      点击选择 .html 日报文件
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm,text/html"
                  className="hidden"
                  onChange={(event) => void handleFileChange(event)}
                />
              </div>
              {htmlError ? (
                <p className="text-sm text-destructive">{htmlError}</p>
              ) : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1 sm:min-w-60">
                      <FormLabel>
                        标题 <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="例如：10月3日工作日报" className="text-[16px] sm:text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reportDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        日报日期 <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                               className={cn(
                                 'w-full justify-start font-normal text-[16px] sm:w-56 sm:text-sm',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon size={16} className="mr-1" />
                              {field.value
                                ? dayjs(field.value).format('YYYY年MM月DD日')
                                : '请选择日期'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? dayjs(field.value).toDate() : undefined
                            }
                            defaultMonth={
                              field.value ? dayjs(field.value).toDate() : new Date()
                            }
                            onSelect={(date: Date | undefined) => {
                              if (date) {
                                field.onChange(dayjs(date).format('YYYY-MM-DD'));
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full justify-center sm:w-auto sm:justify-start sm:self-start">
                <Upload size={16} />
                {submitting ? '上传中...' : '上传日报'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
