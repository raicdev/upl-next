import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@shadcn/context-menu";

interface ChatContextMenuProps {
  onDelete?: () => void;
  onCopy?: () => void;
  children: React.ReactNode;
}

export function ChatContextMenu({ onDelete, onCopy, children }: ChatContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* <ContextMenuItem onClick={onCopy}>
          コピー
        </ContextMenuItem>
        <ContextMenuSeparator /> */}
        <ContextMenuItem onClick={onDelete} className="text-red-500">
          削除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
