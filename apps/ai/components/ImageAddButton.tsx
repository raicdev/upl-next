import { Button } from "@repo/ui/components/button";
import { PlusIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { memo } from "react";

interface ImageAddButtonProps {
  modelSupportsVision: boolean;
  onClick: () => void;
}

export const ImageAddButton = memo(({ modelSupportsVision, onClick }: ImageAddButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "rounded-full",
        !modelSupportsVision && "opacity-50 pointer-events-none"
      )}
      onClick={onClick}
      title="画像を追加"
    >
      <PlusIcon />
    </Button>
  );
});