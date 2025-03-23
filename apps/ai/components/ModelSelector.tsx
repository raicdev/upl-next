import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  ImodelDescriptionType,
  modelDescriptionType,
} from "@/lib/modelDescriptions";
import {
  SiClaude,
  SiGooglegemini,
  SiOpenai,
  SiX,
} from "@icons-pack/react-simple-icons";
import {
  ArrowDown,
  ArrowRight,
  Ban,
  BrainCircuit,
  Eye,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { EasyTip } from "@repo/ui/components/easytip";
import { Link } from "next-view-transitions";
import { useModelVisibility } from "@/hooks/use-model-settings";
import { memo, useCallback, useMemo } from "react";
import { cn } from "@repo/ui/lib/utils";

const ModelItem = memo(
  ({
    modelDescription,
    visionRequired,
    model,
    handleModelChange,
  }: {
    modelDescription: ImodelDescriptionType;
    model: string;
    visionRequired?: boolean;
    handleModelChange: (model: string) => void;
  }) => {
    return (
      <DropdownMenuItem
        disabled={
          modelDescription.offline ||
          (visionRequired && !modelDescription.vision)
        }
        className="w-full cursor-pointer"
        onClick={() => handleModelChange(model)}
      >
        {modelDescription?.type === "ChatGPT" && <SiOpenai />}
        {modelDescription?.type === "Gemini" && <SiGooglegemini />}
        {modelDescription?.type === "Claude" && <SiClaude />}
        {modelDescription?.type === "Grok" && <SiX />}
        {modelDescription?.type === "DeepSeek" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 512 509.64"
          >
            <path
              fill="#fff"
              d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"
            />
            <path
              fill="#4D6BFE"
              fillRule="nonzero"
              d="M440.898 139.167c-4.001-1.961-5.723 1.776-8.062 3.673-.801.612-1.479 1.407-2.154 2.141-5.848 6.246-12.681 10.349-21.607 9.859-13.048-.734-24.192 3.368-34.04 13.348-2.093-12.307-9.048-19.658-19.635-24.37-5.54-2.449-11.141-4.9-15.02-10.227-2.708-3.795-3.447-8.021-4.801-12.185-.861-2.509-1.725-5.082-4.618-5.512-3.139-.49-4.372 2.142-5.601 4.349-4.925 9.002-6.833 18.921-6.647 28.962.432 22.597 9.972 40.597 28.932 53.397 2.154 1.47 2.707 2.939 2.032 5.082-1.293 4.41-2.832 8.695-4.186 13.105-.862 2.817-2.157 3.429-5.172 2.205-10.402-4.346-19.391-10.778-27.332-18.553-13.481-13.044-25.668-27.434-40.873-38.702a177.614 177.614 0 00-10.834-7.409c-15.512-15.063 2.032-27.434 6.094-28.902 4.247-1.532 1.478-6.797-12.251-6.736-13.727.061-26.285 4.653-42.288 10.777-2.34.92-4.801 1.593-7.326 2.142-14.527-2.756-29.608-3.368-45.367-1.593-29.671 3.305-53.368 17.329-70.788 41.272-20.928 28.785-25.854 61.482-19.821 95.59 6.34 35.943 24.683 65.704 52.876 88.974 29.239 24.123 62.911 35.943 101.32 33.677 23.329-1.346 49.307-4.468 78.607-29.27 7.387 3.673 15.142 5.144 28.008 6.246 9.911.92 19.452-.49 26.839-2.019 11.573-2.449 10.773-13.166 6.586-15.124-33.915-15.797-26.47-9.368-33.24-14.573 17.235-20.39 43.213-41.577 53.369-110.222.8-5.448.121-8.877 0-13.287-.061-2.692.553-3.734 3.632-4.041 8.494-.981 16.742-3.305 24.314-7.471 21.975-12.002 30.84-31.719 32.933-55.355.307-3.612-.061-7.348-3.879-9.245v-.003zM249.4 351.89c-32.872-25.838-48.814-34.352-55.4-33.984-6.155.368-5.048 7.41-3.694 12.002 1.415 4.532 3.264 7.654 5.848 11.634 1.785 2.634 3.017 6.551-1.784 9.493-10.587 6.55-28.993-2.205-29.856-2.635-21.421-12.614-39.334-29.269-51.954-52.047-12.187-21.924-19.267-45.435-20.435-70.542-.308-6.061 1.478-8.207 7.509-9.307 7.94-1.471 16.127-1.778 24.068-.615 33.547 4.9 62.108 19.902 86.054 43.66 13.666 13.531 24.007 29.699 34.658 45.496 11.326 16.778 23.514 32.761 39.026 45.865 5.479 4.592 9.848 8.083 14.035 10.656-12.62 1.407-33.673 1.714-48.075-9.676zm15.899-102.519c.521-2.111 2.421-3.658 4.722-3.658a4.74 4.74 0 011.661.305c.678.246 1.293.614 1.786 1.163.861.859 1.354 2.083 1.354 3.368 0 2.695-2.154 4.837-4.862 4.837a4.748 4.748 0 01-4.738-4.034 5.01 5.01 0 01.077-1.981zm47.208 26.915c-2.606.996-5.2 1.778-7.707 1.88-4.679.244-9.787-1.654-12.556-3.981-4.308-3.612-7.386-5.631-8.679-11.941-.554-2.695-.247-6.858.246-9.246 1.108-5.144-.124-8.451-3.754-11.451-2.954-2.449-6.711-3.122-10.834-3.122-1.539 0-2.954-.673-4.001-1.224-1.724-.856-3.139-3-1.785-5.634.432-.856 2.525-2.939 3.018-3.305 5.6-3.185 12.065-2.144 18.034.244 5.54 2.266 9.727 6.429 15.759 12.307 6.155 7.102 7.263 9.063 10.773 14.39 2.771 4.163 5.294 8.451 7.018 13.348.877 2.561.071 4.74-2.341 6.277-.981.625-2.109 1.044-3.191 1.458z"
            />
          </svg>
        )}
        <div className="flex items-center w-full justify-between">
          <span className="text-base">{modelDescription.displayName}</span>
          <div className="flex items-center gap-2">
            {modelDescription?.offline && (
              <EasyTip content="オフライン">
                <Badge variant="destructive" className="p-1 flex gap-1">
                  <Ban size="16" />
                </Badge>
              </EasyTip>
            )}

            {modelDescription?.fast && (
              <EasyTip content="高速">
                <Badge className="p-1">
                  <Zap size="16" />
                </Badge>
              </EasyTip>
            )}

            {modelDescription?.vision && (
              <EasyTip content="画像を認識可能">
                <Badge className="p-1">
                  <Eye size="16" />
                </Badge>
              </EasyTip>
            )}

            {modelDescription?.reasoning && (
              <EasyTip content={`推論可能`}>
                <Badge className="p-1">
                  <BrainCircuit size="16" />
                </Badge>
              </EasyTip>
            )}
          </div>
        </div>
      </DropdownMenuItem>
    );
  }
);
ModelItem.displayName = "ModelItem";

export const ModelSelector = memo(function ModelSelector({
  modelDescriptions,
  model,
  visionRequired,
  handleModelChange,
  refreshIcon,
}: {
  modelDescriptions: modelDescriptionType;
  model: string;
  visionRequired?: boolean;
  refreshIcon?: boolean;
  handleModelChange: (model: string) => void;
}) {
  const { visibility } = useModelVisibility();

  const ModelIcon = useMemo(() => {
    if (refreshIcon) return <RefreshCw />;
    switch (modelDescriptions[model]?.type) {
      case "ChatGPT":
        return <SiOpenai />;
      case "Gemini":
        return <SiGooglegemini />;
      case "Claude":
        return <SiClaude />;
      case "Grok":
        return <SiX />;
      case "DeepSeek":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 512 509.64"
          >
            <path
              fill="#fff"
              d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"
            />
            <path
              fill="#4D6BFE"
              fillRule="nonzero"
              d="M440.898 139.167c-4.001-1.961-5.723 1.776-8.062 3.673-.801.612-1.479 1.407-2.154 2.141-5.848 6.246-12.681 10.349-21.607 9.859-13.048-.734-24.192 3.368-34.04 13.348-2.093-12.307-9.048-19.658-19.635-24.37-5.54-2.449-11.141-4.9-15.02-10.227-2.708-3.795-3.447-8.021-4.801-12.185-.861-2.509-1.725-5.082-4.618-5.512-3.139-.49-4.372 2.142-5.601 4.349-4.925 9.002-6.833 18.921-6.647 28.962.432 22.597 9.972 40.597 28.932 53.397 2.154 1.47 2.707 2.939 2.032 5.082-1.293 4.41-2.832 8.695-4.186 13.105-.862 2.817-2.157 3.429-5.172 2.205-10.402-4.346-19.391-10.778-27.332-18.553-13.481-13.044-25.668-27.434-40.873-38.702a177.614 177.614 0 00-10.834-7.409c-15.512-15.063 2.032-27.434 6.094-28.902 4.247-1.532 1.478-6.797-12.251-6.736-13.727.061-26.285 4.653-42.288 10.777-2.34.92-4.801 1.593-7.326 2.142-14.527-2.756-29.608-3.368-45.367-1.593-29.671 3.305-53.368 17.329-70.788 41.272-20.928 28.785-25.854 61.482-19.821 95.59 6.34 35.943 24.683 65.704 52.876 88.974 29.239 24.123 62.911 35.943 101.32 33.677 23.329-1.346 49.307-4.468 78.607-29.27 7.387 3.673 15.142 5.144 28.008 6.246 9.911.92 19.452-.49 26.839-2.019 11.573-2.449 10.773-13.166 6.586-15.124-33.915-15.797-26.47-9.368-33.24-14.573 17.235-20.39 43.213-41.577 53.369-110.222.8-5.448.121-8.877 0-13.287-.061-2.692.553-3.734 3.632-4.041 8.494-.981 16.742-3.305 24.314-7.471 21.975-12.002 30.84-31.719 32.933-55.355.307-3.612-.061-7.348-3.879-9.245v-.003zM249.4 351.89c-32.872-25.838-48.814-34.352-55.4-33.984-6.155.368-5.048 7.41-3.694 12.002 1.415 4.532 3.264 7.654 5.848 11.634 1.785 2.634 3.017 6.551-1.784 9.493-10.587 6.55-28.993-2.205-29.856-2.635-21.421-12.614-39.334-29.269-51.954-52.047-12.187-21.924-19.267-45.435-20.435-70.542-.308-6.061 1.478-8.207 7.509-9.307 7.94-1.471 16.127-1.778 24.068-.615 33.547 4.9 62.108 19.902 86.054 43.66 13.666 13.531 24.007 29.699 34.658 45.496 11.326 16.778 23.514 32.761 39.026 45.865 5.479 4.592 9.848 8.083 14.035 10.656-12.62 1.407-33.673 1.714-48.075-9.676zm15.899-102.519c.521-2.111 2.421-3.658 4.722-3.658a4.74 4.74 0 011.661.305c.678.246 1.293.614 1.786 1.163.861.859 1.354 2.083 1.354 3.368 0 2.695-2.154 4.837-4.862 4.837a4.748 4.748 0 01-4.738-4.034 5.01 5.01 0 01.077-1.981zm47.208 26.915c-2.606.996-5.2 1.778-7.707 1.88-4.679.244-9.787-1.654-12.556-3.981-4.308-3.612-7.386-5.631-8.679-11.941-.554-2.695-.247-6.858.246-9.246 1.108-5.144-.124-8.451-3.754-11.451-2.954-2.449-6.711-3.122-10.834-3.122-1.539 0-2.954-.673-4.001-1.224-1.724-.856-3.139-3-1.785-5.634.432-.856 2.525-2.939 3.018-3.305 5.6-3.185 12.065-2.144 18.034.244 5.54 2.266 9.727 6.429 15.759 12.307 6.155 7.102 7.263 9.063 10.773 14.39 2.771 4.163 5.294 8.451 7.018 13.348.877 2.561.071 4.74-2.341 6.277-.981.625-2.109 1.044-3.191 1.458z"
            />
          </svg>
        );
      default:
        return null;
    }
  }, [refreshIcon, model, modelDescriptions]);

  const filteredModels = useMemo(() => {
    return Object.keys(modelDescriptions)
      .filter((modelKey) => visibility[modelKey])
      .map((modelKey) => ({
        key: modelKey,
        description: modelDescriptions[modelKey] as ImodelDescriptionType,
      }));
  }, [modelDescriptions, visibility]);

  const memoizedHandleModelChange = useCallback(handleModelChange, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="m-0" asChild>
        <Button
          variant={refreshIcon ? "ghost" : "secondary"}
          className={cn("p-2 rounded-full", refreshIcon && "!p-1")}
        >
          {ModelIcon}
          <span className="inline-flex items-center justify-center">
            {modelDescriptions[model]?.displayName}{" "}
          </span>
          <ArrowDown className="text-zinc-400 text-sm" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel className="pb-0!">モデル</DropdownMenuLabel>
        {visionRequired && (
          <div className="ml-2">
            <span className="text-sm text-muted-foreground">
              この会話には画像を含んでいるため、画像対応モデルのみが利用可能です。
            </span>
          </div>
        )}
        <DropdownMenuGroup>
          {filteredModels.map((model) => (
            <ModelItem
              key={model.key}
              model={model.key}
              modelDescription={
                modelDescriptions[model.key] as ImodelDescriptionType
              }
              visionRequired={visionRequired}
              handleModelChange={memoizedHandleModelChange}
            />
          ))}
          {!refreshIcon && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <div className="flex items-center justify-between w-full">
                  <Link href={"/settings/model"}>表示するモデルを管理</Link>
                  <ArrowRight />
                </div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
