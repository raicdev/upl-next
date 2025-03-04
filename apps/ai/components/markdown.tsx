import { Button } from "@repo/ui/components/button";
import { ClassAttributes, HTMLAttributes, memo, useState, ReactNode } from "react";
import { ExtraProps } from "react-markdown";

interface PreProps extends ClassAttributes<HTMLPreElement>,
  HTMLAttributes<HTMLPreElement>,
  ExtraProps {
  children?: ReactNode;
}

// Type guard to check if value is a non-null object
const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const Pre = memo(
  ({
    children,
    ...props
  }: PreProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      if (!children) return;

      // Safely extract code content from children
      let code = '';
      if (isObject(children) && 'props' in children && isObject(children.props)) {
        code = String(children.props.children || '');
      }

      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="not-prose flex flex-col">
        <div className="relative">
          <Button
            onClick={handleCopy}
            variant="ghost"
            className="absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
          <pre
            {...props}
            className={`text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
          >
            <code className="whitespace-pre-wrap break-words">{children}</code>
          </pre>
        </div>
      </div>
    );
  }
);

Pre.displayName = "Pre";