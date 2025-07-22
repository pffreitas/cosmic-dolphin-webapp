"use client";

import React, { useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExpandableDropdownProps {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  content: string;
  onClose: () => void;
  onExpandClick: (content: string) => void;
}

export default function ExpandableDropdown({
  isOpen,
  position,
  content,
  onClose,
  onExpandClick,
}: ExpandableDropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && position && triggerRef.current) {
      // Position the invisible trigger at the click position
      triggerRef.current.style.position = "absolute";
      triggerRef.current.style.left = `${position.x}px`;
      triggerRef.current.style.top = `${position.y}px`;
      triggerRef.current.style.width = "1px";
      triggerRef.current.style.height = "1px";
      triggerRef.current.style.pointerEvents = "none";
    }
  }, [isOpen, position]);

  if (!isOpen || !position) {
    return null;
  }

  return (
    <div
      ref={triggerRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 1000,
      }}
    >
      <DropdownMenu open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DropdownMenuTrigger asChild>
          <div style={{ width: 1, height: 1 }} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom">
          <DropdownMenuItem
            onClick={() => {
              onExpandClick(content);
              onClose();
            }}
            className="cursor-pointer"
          >
            Expand on this
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}