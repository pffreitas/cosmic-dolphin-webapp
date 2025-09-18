"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MessageSquareText } from "lucide-react";
import {} from "../ai-elements/chain-of-thought";
import { useActiveSession } from "@/lib/store/realtimeSelectors";

export function AppSidebar() {
  const activeSession = useActiveSession();
  return (
    <Sidebar side="right" variant="floating" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <MessageSquareText className="!size-5" />
                <span className="text-base font-semibold">Activity</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <pre>{JSON.stringify(activeSession, null, 2)}</pre>
      </SidebarContent>
    </Sidebar>
  );
}
