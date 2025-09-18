"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Activity,
  LayoutDashboard,
  MessageSquareText,
  SearchIcon,
  BrainIcon,
} from "lucide-react";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
} from "../ai-elements/chain-of-thought";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export function AppSidebar() {
  const events = useSelector((state: RootState) => state.realtime.eventQueue);
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
        {events.map((event, index) => (
          <pre key={`event-${index}`}>{JSON.stringify(event, null, 2)}</pre>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
