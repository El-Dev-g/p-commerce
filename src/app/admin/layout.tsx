
'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar
} from '@/components/ui/sidebar';
import { LayoutDashboard, Package, ShoppingCart, Settings, Sparkles, Newspaper, Undo2, GitBranch, TrendingUp, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';

function AdminSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };
  
  const handleLinkClick = () => {
    setOpenMobile(false);
  }

  return (
    <Sidebar side="left" collapsible="icon" variant="sidebar">
      <SidebarHeader>
          <div className="flex items-center gap-2 p-2 justify-between">
              <div className="flex items-center gap-2">
                  <Sparkles className="h-7 w-7 text-primary" />
                  <span className="font-headline text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">
                  Curated
                  </span>
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                  <ModeToggle />
              </div>
          </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/dashboard')}
              tooltip="Dashboard"
              onClick={handleLinkClick}
            >
              <Link href="/admin/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/analytics')}
              tooltip="Analytics"
              onClick={handleLinkClick}
            >
              <Link href="/admin/analytics">
                <TrendingUp />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/chat')}
              tooltip="Chat"
              onClick={handleLinkClick}
            >
              <Link href="/admin/chat">
                <MessageSquare />
                <span>Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/products')}
              tooltip="Products"
              onClick={handleLinkClick}
            >
              <Link href="/admin/products">
                <Package />
                <span>Products</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/variations')}
              tooltip="Variations"
              onClick={handleLinkClick}
            >
              <Link href="/admin/variations">
                <GitBranch />
                <span>Variations</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/orders')}
              tooltip="Orders"
              onClick={handleLinkClick}
            >
              <Link href="/admin/orders">
                <ShoppingCart />
                <span>Orders</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/refunds')}
              tooltip="Refunds"
              onClick={handleLinkClick}
            >
              <Link href="/admin/refunds">
                <Undo2 />
                <span>Refunds</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/pages')}
              tooltip="Pages"
              onClick={handleLinkClick}
            >
              <Link href="/admin/pages">
                <Newspaper />
                <span>Pages</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/settings')}
              tooltip="Settings"
              onClick={handleLinkClick}
            >
              <Link href="/admin/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
            {/* Header content can go here, e.g. search bar */}
            </div>
            <div className="md:hidden">
                <ModeToggle />
            </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
