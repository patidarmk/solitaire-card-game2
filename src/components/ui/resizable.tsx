"use client"

import * as React from "react"
import * as ResizablePrimitive from "react-resizable-panels"
import { GripVertical } from "lucide-react"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-direction=horizontal]:flex-col data-[panel-direction=vertical]:h-[100vh] data-[panel-direction=vertical]:flex-row",
      className
    )}
    {...props}
  />
)
ResizablePanelGroup.displayName = ResizablePrimitive.PanelGroup.displayName

const ResizablePanel = ResizablePrimitive.Panel

const ResizablePanelSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle>) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "shrink-0 data-[orientation=horizontal]:w-px data-[orientation=vertical]:h-px bg-border",
      className
    )}
    {...props}
  />
)
ResizablePanelSeparator.displayName = ResizablePrimitive.PanelResizeHandle.displayName

const ResizableHandle = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  orientation?: "vertical" | "horizontal"
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "flex items-center justify-center h-4 data-[orientation=vertical]:w-4 data-[orientation=horizontal]:h-4 data-[orientation=vertical]:w-full data-[orientation=horizontal]:w-full",
      orientation === "vertical" && "ml-1 h-4 w-4",
      orientation === "horizontal" && "mb-1 h-4 w-full",
      className
    )}
    {...props}
  >
    <GripVertical className="h-4 w-4" />
  </ResizablePrimitive.PanelResizeHandle>
)
ResizableHandle.displayName = ResizablePrimitive.PanelResizeHandle.displayName

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizablePanelSeparator,
  ResizableHandle,
}