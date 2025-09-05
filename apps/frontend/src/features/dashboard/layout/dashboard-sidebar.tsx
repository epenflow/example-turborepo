import { Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ChevronsUpDown, Settings } from "lucide-react";

import { DASHBOARD_SIDEBAR } from "../constants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "~/components/ui";
import { CurrentUserDisplay, SignOutButton } from "~/features/auth";
import { useIsMobile } from "~/hooks";

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <DashboardSidebarContent />
      <DashboardSidebarFooter />
    </Sidebar>
  );
}

function DashboardSidebarFooter() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent">
                <CurrentUserDisplay />
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="end"
              side={
                isMobile ? "bottom" : state === "collapsed" ? "left" : "bottom"
              }>
              <DropdownMenuLabel>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <CurrentUserDisplay showEmail />
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/account" className="block w-full">
                    <Settings className="mr-2" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <SignOutButton className="[&_svg]:mr-2 w-full" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

function DashboardSidebarContent() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Applications</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="[&_a]:data-[status=active]:bg-muted">
            {DASHBOARD_SIDEBAR.map((nav, key) => (
              <Fragment key={key}>
                {"to" in nav ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={nav.title}>
                      <Link to={nav.to}>
                        {nav.icon && <nav.icon />}
                        <span>{nav.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <Collapsible asChild className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={nav.title}>
                          {nav.icon && <nav.icon />}
                          <span>{nav.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {nav.sub.map(
                            (sub, subKey) =>
                              "to" in sub && (
                                <SidebarMenuSubItem key={subKey}>
                                  <SidebarMenuSubButton asChild>
                                    <Link to={sub.to}>
                                      {sub.icon && <sub.icon />}
                                      <span>{sub.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ),
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )}
              </Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
