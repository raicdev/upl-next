"use client";

import { memo } from "react";
import { ThinkingEffort } from "@/hooks/use-chat-sessions";
import { modelDescriptions } from "@/lib/modelDescriptions";
import InputBox from "./InputBox";
import { ModelSelector } from "./ModelSelector";
import { ImagePreview } from "./ImagePreview";
import { ImageAddButton } from "./ImageAddButton";
import { ThinkingEffortSelector } from "./ThinkingEffortSelector";

type ModelDescription = typeof modelDescriptions[keyof typeof modelDescriptions];

interface ChatInputProps {
  input: string;
  image: string | null;
  isUploading: boolean;
  model: string;
  visionRequired: boolean;
  currentThinkingEffort: ThinkingEffort;
  modelDescriptions: Record<string, ModelDescription>;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSendMessageKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleImagePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleModelChange: (model: string) => void;
  setImage: (image: string | null) => void;
  setCurrentThinkingEffort: (effort: ThinkingEffort) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const ChatInput = memo(
  ({
    input,
    image,
    isUploading,
    model,
    visionRequired,
    currentThinkingEffort,
    modelDescriptions,
    handleInputChange,
    handleSendMessage,
    handleSendMessageKey,
    handleImagePaste,
    handleImageUpload,
    handleModelChange,
    setImage,
    setCurrentThinkingEffort,
    fileInputRef,
  }: ChatInputProps) => {
    return (
      <div className="mt-4 border p-2 rounded md:w-9/12 lg:w-7/12">
        {image && (
          <ImagePreview
            image={image}
            isUploading={isUploading}
            setImage={setImage}
          />
        )}
        <InputBox
          input={input}
          handleInputChange={handleInputChange}
          handleSendMessage={handleSendMessage}
          handleSendMessageKey={handleSendMessageKey}
          handleImagePaste={handleImagePaste}
        />
        <div className="flex items-center gap-1">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <ImageAddButton
            modelSupportsVision={!!modelDescriptions[model]?.vision}
            onClick={() => fileInputRef.current?.click()}
          />
          <ModelSelector
            model={model}
            refreshIcon={false}
            visionRequired={visionRequired}
            handleModelChange={handleModelChange}
            modelDescriptions={modelDescriptions}
          />
          {modelDescriptions[model]?.thinkingEfforts && (
            <ThinkingEffortSelector
              currentThinkingEffort={currentThinkingEffort}
              availableEfforts={modelDescriptions[model].thinkingEfforts || []}
              setCurrentThinkingEffort={setCurrentThinkingEffort}
            />
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.input === nextProps.input &&
      prevProps.image === nextProps.image &&
      prevProps.isUploading === nextProps.isUploading &&
      prevProps.model === nextProps.model &&
      prevProps.visionRequired === nextProps.visionRequired &&
      prevProps.currentThinkingEffort === nextProps.currentThinkingEffort &&
      JSON.stringify(prevProps.modelDescriptions) === JSON.stringify(nextProps.modelDescriptions)
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;