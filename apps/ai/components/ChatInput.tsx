import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Button } from "@repo/ui/components/button";
import { SendHorizonal, StopCircleIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isSending: boolean;
}

const ChatInput = ({ onSendMessage, isSending, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onSendMessage(message);
      }
    },
    [message, onSendMessage]
  );

  return (
    <div className="flex items-center w-full mb-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="AI にメッセージを送信する"
        className="w-full px-3 py-2 resize-none bg-transparent border-none shadow-none !outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-0"
        onKeyDown={handleKeyDown}
      />
      <Button
        aria-label="送信"
        className="ml-3"
        disabled={!message || isSending || disabled}
        size="icon"
        onClick={() => onSendMessage(message)}
      >
        {isSending ? <StopCircleIcon /> : <SendHorizonal />}
      </Button>
    </div>
  );
};

export default React.memo(ChatInput);
