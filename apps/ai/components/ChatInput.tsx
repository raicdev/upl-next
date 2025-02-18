import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "@repo/ui/components/button";
import { SendHorizonal } from "lucide-react";

export interface ChatInputHandles {
  getValue: () => string;
  clear: () => void;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = forwardRef<ChatInputHandles, ChatInputProps>(
  ({ onSendMessage }, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      getValue: () => inputRef.current?.value || "",
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
    }));

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          const message = inputRef.current?.value || "";
          if (message.trim() !== "") {
            onSendMessage(message);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }
        }
      },
      [onSendMessage]
    );

    return (
      <div className="flex items-center w-full mb-2">
        <textarea
          ref={inputRef}
          placeholder="AI にメッセージを送信する"
          className="w-full px-3 py-2 resize-none bg-transparent border-none shadow-none !outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-0"
          onKeyDown={handleKeyDown}
        />
        <Button
          aria-label="送信"
          className="ml-3"
          size="icon"
          onClick={() => {
            const message = inputRef.current?.value || "";
            if (message.trim() !== "") {
              onSendMessage(message);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }
          }}
        >
          <SendHorizonal />
        </Button>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
export default React.memo(ChatInput);
