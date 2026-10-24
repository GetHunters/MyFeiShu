import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FileText, NotebookPen, Upload, Wrench, ClipboardList, LogIn, LogOut, Video, ScrollText, UploadCloud, CalendarDays, ListChecks, Menu } from 'lucide-react';
import { Button } from '@client/src/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@client/src/components/ui/sheet';
import AdminLoginDialog from '@client/src/components/AdminLoginDialog';
import { AdminAuthProvider, useAdminAuth } from '@client/src/contexts/AdminAuthContext';

const LayoutContent = () => {
  const { isLoggedIn, logout } = useAdminAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex w-full items-center justify-start gap-1.5 rounded-md px-3 py-3 text-sm transition-colors md:w-auto md:py-1.5 ${
      isActive
        ? 'bg-primary/10 font-medium text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <NotebookPen size={16} />
            </span>
            <span className="text-base font-semibold">每日工作日报</span>
          </NavLink>
          <div className="flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="打开导航菜单"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80 p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <NotebookPen size={16} />
                      </span>
                      <span className="text-base font-semibold">每日工作日报</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-3">
                  <SheetClose asChild>
                    <NavLink to="/" className={navLinkClass} end>
                      <FileText size={16} />
                      日报列表
                    </NavLink>
                  </SheetClose>
                  <SheetClose asChild>
                    <NavLink to="/mes-summary" className={navLinkClass}>
                      <ListChecks size={16} />
                      MES每日总结
                    </NavLink>
                  </SheetClose>
                  {isLoggedIn && (
                    <>
                      <SheetClose asChild>
                        <NavLink to="/maintenance" className={navLinkClass}>
                          <CalendarDays size={16} />
                          每日工作
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/admin/summaries" className={navLinkClass}>
                          <ClipboardList size={16} />
                          工作总结
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/admin/video-archive" className={navLinkClass}>
                          <Video size={16} />
                          视频档案
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/admin/changelog" className={navLinkClass}>
                          <ScrollText size={16} />
                          更新日志
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/admin/upload-log" className={navLinkClass}>
                          <UploadCloud size={16} />
                          上传记录
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/admin/upload" className={navLinkClass}>
                          <Upload size={16} />
                          上传日报
                        </NavLink>
                      </SheetClose>
                    </>
                  )}
                </nav>
                <div className="mt-auto border-t p-3">
                  {isLoggedIn ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="w-full justify-start"
                      aria-label="退出登录"
                    >
                      <LogOut size={16} />
                      退出登录
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLoginOpen(true)}
                      className="w-full justify-start"
                      aria-label="管理员登录"
                    >
                      <LogIn size={16} />
                      管理员登录
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/" className={navLinkClass} end>
                <FileText size={16} />
                日报列表
              </NavLink>
              <NavLink to="/mes-summary" className={navLinkClass}>
                <ListChecks size={16} />
                MES每日总结
              </NavLink>
              {isLoggedIn && (
                <>
                  <NavLink to="/maintenance" className={navLinkClass}>
                    <CalendarDays size={16} />
                    每日工作
                  </NavLink>
                  <NavLink to="/admin/summaries" className={navLinkClass}>
                    <ClipboardList size={16} />
                    工作总结
                  </NavLink>
                  <NavLink to="/admin/video-archive" className={navLinkClass}>
                    <Video size={16} />
                    视频档案
                  </NavLink>
                  <NavLink to="/admin/changelog" className={navLinkClass}>
                    <ScrollText size={16} />
                    更新日志
                  </NavLink>
                  <NavLink to="/admin/upload-log" className={navLinkClass}>
                    <UploadCloud size={16} />
                    上传记录
                  </NavLink>
                  <NavLink to="/admin/upload" className={navLinkClass}>
                    <Upload size={16} />
                    上传日报
                  </NavLink>
                </>
              )}
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="ml-2"
                  aria-label="退出登录"
                >
                  <LogOut size={16} />
                  退出
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLoginOpen(true)}
                  className="ml-2"
                  aria-label="管理员登录"
                >
                  <LogIn size={16} />
                  管理员登录
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        记录每一个工作日
      </footer>
      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};

const Layout = () => (
  <AdminAuthProvider>
    <LayoutContent />
  </AdminAuthProvider>
);

export default Layout;
