
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
  SidebarInset
} from '@/components/ui/sidebar';
import { LayoutDashboard, Package, ShoppingCart, Settings, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <SidebarProvider>
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
                isActive={isActive('/admin/products')}
                tooltip="Products"
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
                isActive={isActive('/admin/orders')}
                tooltip="Orders"
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
                isActive={isActive('/admin/settings')}
                tooltip="Settings"
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
