import { Button } from "@repo/ui/components/button";
import { Brain } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { ThinkingEffort } from "@/hooks/use-chat-sessions";
import { memo } from "react";

interface ThinkingEffortSelectorProps {
  currentThinkingEffort: ThinkingEffort;
  availableEfforts: ThinkingEffort[];
  setCurrentThinkingEffort: (effort: ThinkingEffort) => void;
}

export const ThinkingEffortSelector = memo(({
  currentThinkingEffort,
  availableEfforts,
  setCurrentThinkingEffort,
}: ThinkingEffortSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Brain />
          {currentThinkingEffort.charAt(0).toUpperCase() +
            currentThinkingEffort.slice(1)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {availableEfforts.map((effort: ThinkingEffort) => (
          <DropdownMenuItem
            key={effort}
            onClick={() => {
              setCurrentThinkingEffort(effort);
            }}
          >
            {effort.charAt(0).toUpperCase() + effort.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});