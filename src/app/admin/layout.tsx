
'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Sparkles,
  Newspaper,
  Undo2,
  GitBranch,
  TrendingUp,
  MessageSquare,
  Store,
  Users as UsersIcon,
  Tag,
  Building,
  ExternalLink,
  PenSquare,
  ClipboardList,
  Palette,
  Megaphone,
  Mail,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';
import * as React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

function AdminSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [openCollapsibles, setOpenCollapsibles] = React.useState<Record<string, boolean>>({
    products: true,
  });

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };
  
  const handleLinkClick = () => {
    if(setOpenMobile) {
      setOpenMobile(false);
    }
  }

  const toggleCollapsible = (name: string) => {
    setOpenCollapsibles(prev => ({...prev, [name]: !prev[name]}));
  }

  return (
    <Sidebar side="left" collapsible="icon" variant="sidebar">
      <SidebarHeader>
          <div className="flex items-center gap-2 p-2 justify-between">
              <div className="flex items-center gap-2">
                  <Sparkles className="h-7 w-7 text-primary" />
                  <span className="font-headline text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">
                  p-commerce
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
              tooltip="Home"
              onClick={handleLinkClick}
            >
              <Link href="/admin/dashboard">
                <LayoutDashboard />
                <span>Home</span>
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
              tooltip="Returns"
              onClick={handleLinkClick}
            >
              <Link href="/admin/refunds">
                <Undo2 />
                <span>Returns</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Collapsible open={openCollapsibles['products']} onOpenChange={() => toggleCollapsible('products')}>
                <CollapsibleTrigger asChild>
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
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={isActive('/admin/variations')} asChild>
                          <Link href="/admin/variations">
                              <ClipboardList />
                              <span>Variations</span>
                          </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/vendors')}
              tooltip="Vendors"
              onClick={handleLinkClick}
            >
              <Link href="/admin/vendors">
                <Building />
                <span>Vendors</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/customers')}
              tooltip="Customers"
              onClick={handleLinkClick}
            >
              <Link href="/admin/customers">
                <UsersIcon />
                <span>Customers</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Collapsible open={openCollapsibles['marketing']} onOpenChange={() => toggleCollapsible('marketing')}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={isActive('/admin/marketing')}
                        tooltip="Marketing"
                    >
                        <Megaphone />
                        <span>Marketing</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={isActive('/admin/promotions')} asChild>
                            <Link href="/admin/promotions">
                                <Tag />
                                <span>Promotions</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={pathname.includes('/admin/marketing/newsletter')} asChild>
                            <Link href="/admin/marketing/newsletter">
                                <Newspaper />
                                <span>Newsletter</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={isActive('/admin/marketing/newsletter/create')} asChild>
                            <Link href="/admin/marketing/newsletter/create">
                                <Mail />
                                <span>Create Newsletter</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/analytics')}
              tooltip="Reports"
              onClick={handleLinkClick}
            >
              <Link href="/admin/analytics">
                <TrendingUp />
                <span>Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/admin/app-store')}
              tooltip="Integrations"
              onClick={handleLinkClick}
            >
              <Link href="/admin/app-store">
                <GitBranch />
                <span>Integrations</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Collapsible open={openCollapsibles['settings']} onOpenChange={() => toggleCollapsible('settings')}>
                <CollapsibleTrigger asChild>
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
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={isActive('/admin/settings/profile')} asChild>
                          <Link href="/admin/settings/profile">
                              <User />
                              <span>User Profile</span>
                          </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
       <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel>Store</SidebarGroupLabel>
            <SidebarMenu>
                <Collapsible open={openCollapsibles['storefront']} onOpenChange={() => toggleCollapsible('storefront')} defaultValue="true">
                  <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                              asChild
                              isActive={isActive('/admin/storefront')}
                              tooltip="Storefront Editor"
                          >
                              <Link href="/admin/storefront">
                                  <Store />
                                  <span>Storefront</span>
                              </Link>
                          </SidebarMenuButton>
                      </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/storefront" target="_blank" rel="noopener noreferrer">
                            <ExternalLink />
                            <span>View Live Site</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                       <SidebarMenuSubItem>
                         <SidebarMenuSubButton isActive={isActive('/admin/storefront/theme')} asChild>
                            <Link href="/admin/storefront/theme">
                                <Palette />
                                <span>Theme</span>
                            </Link>
                         </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton isActive={isActive('/admin/pages')} asChild>
                            <Link href="/admin/pages">
                                <Newspaper />
                                <span>Content Pages</span>
                            </Link>
                         </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
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
